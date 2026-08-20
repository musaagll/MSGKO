// ============================================================
// USKO item_org_us.tbl Reader
// Decrypt logic from co3moz/ko-tbl-reader (MIT License)
// Reads real Knight Online USKO item data
// ============================================================

const fs = require('fs')
const path = require('path')

// --- Decrypt (from co3moz/ko-tbl-reader) ---
function standardDecode(buffer) {
  let key1 = 0x0816
  let key2 = 0x6081
  let key3 = 0x1608
  const out = Buffer.allocUnsafe(buffer.length)
  for (let i = 0; i < buffer.length; i++) {
    const data = buffer[i]
    out[i] = data ^ (key1 >> 8)
    key1 = ((data + key1) * key2 + key3) & 0xffff
  }
  return out
}

function standardDetermine(buffer) {
  const temp = Buffer.allocUnsafe(Math.min(buffer.length, 1024 * 10))
  let v = 0x0816
  const max = Math.min(buffer.length, temp.length)
  for (let i = 0; i < max; i++) {
    const data = buffer[i]
    const out = data ^ (v >> 8)
    v = ((data + v) * 0x6081 + 0x1608) & 0xffff
    temp[i] = out
    if (i === 3) {
      const amount = temp.readInt32LE(0)
      if (amount > 1000 || amount < 1) return false
    } else if (i % 4 === 0 && i !== 0 && i !== 4) {
      const headerType = temp.readInt32LE(i - 4)
      if (headerType > 11 || headerType < 0) return false
    }
  }
  return true
}

// --- Parser (from co3moz/ko-tbl-reader) ---
function parseTBL(buffer) {
  let offset = 0
  if (buffer.length < 8) return { columns: [], columnCount: 0, rowCount: 0, rows: [] }
  
  const columnCount = buffer.readInt32LE(offset); offset += 4
  if (columnCount < 1 || columnCount > 500) {
    console.log('Invalid column count:', columnCount)
    return { columns: [], columnCount: 0, rowCount: 0, rows: [] }
  }
  
  const columns = []
  for (let i = 0; i < columnCount; i++) {
    if (offset + 4 > buffer.length) break
    columns.push(buffer.readInt32LE(offset)); offset += 4
  }
  
  if (offset + 4 > buffer.length) return { columns, columnCount, rowCount: 0, rows: [] }
  const rowCount = buffer.readInt32LE(offset); offset += 4
  
  if (rowCount < 0 || rowCount > 200000) {
    console.log('Invalid row count:', rowCount)
    return { columns, columnCount, rowCount: 0, rows: [] }
  }
  
  const rows = []

  for (let i = 0; i < rowCount; i++) {
    if (offset >= buffer.length) break
    const data = []
    for (let c = 0; c < columnCount; c++) {
      if (offset >= buffer.length) { data.push(0); continue }
      const t = columns[c]
      try {
        switch (t) {
          case 1: data.push(buffer.readInt8(offset)); offset++; break
          case 2: data.push(buffer.readUInt8(offset)); offset++; break
          case 3: data.push(buffer.readInt16LE(offset)); offset += 2; break
          case 4: data.push(buffer.readUInt16LE(offset)); offset += 2; break
          case 5: data.push(buffer.readInt32LE(offset)); offset += 4; break
          case 6: data.push(buffer.readUInt32LE(offset)); offset += 4; break
          case 7: {
            if (offset + 4 > buffer.length) { data.push(''); break }
            const strlen = buffer.readInt32LE(offset); offset += 4
            if (strlen < 0 || strlen > 10000 || offset + strlen > buffer.length) { data.push(''); break }
            const raw = buffer.slice(offset, offset + strlen)
            let str
            if (strlen > 1 && raw[1] === 0) {
              str = raw.toString('utf16le').replace(/\0/g, '')
            } else {
              str = raw.toString('latin1').replace(/\0/g, '')
            }
            data.push(str)
            offset += strlen
            break
          }
          case 8: data.push(buffer.readFloatLE(offset)); offset += 4; break
          case 9: data.push(buffer.readDoubleLE(offset)); offset += 8; break
          case 10: case 11:
            data.push([buffer.readInt32LE(offset), buffer.readInt32LE(offset + 4)])
            offset += 8; break
          default: data.push(0); break
        }
      } catch(e) {
        data.push(0)
      }
    }
    rows.push(data)
  }
  return { columns, columnCount, rowCount, rows }
}

// --- item_org schema (known from ko4life-net/ko-db) ---
// Num, strName, Kind, Slot, Race, Class, Damage, Delay, Range, Weight,
// Duration, BuyPrice, SellPrice, Ac, Countable, Effect1, Effect2,
// ReqLevel, ReqRank, ReqTitle, ReqStr, ReqSta, ReqDex, ReqIntel, ReqCha,
// SellingGroup, ItemType, Hitrate, Evasionrate, ...bonus fields

function getEquipmentSlotKey(kind) {
  if (kind === 110) return 'HELMET'
  if (kind === 120) return 'ARMOR'
  if (kind === 130) return 'PADS'
  if (kind === 140) return 'GLOVES'
  if (kind === 150) return 'BOOTS'
  if (kind === 160) return 'LEFT_HAND'  // shield
  if (kind >= 10 && kind < 100) return 'RIGHT_HAND' // weapon
  if (kind === 210) return 'RING_1'
  if (kind === 220) return 'NECKLACE'
  if (kind === 230) return 'EARRING_1'
  if (kind === 510 || kind === 520) return 'WINGS'
  if (kind === 600) return 'PET'
  return null
}

function getItemType(kind) {
  if (kind >= 10 && kind < 100) return 'weapon'
  if (kind >= 110 && kind <= 160) return 'armor'
  if (kind >= 200 && kind < 300) return 'accessory'
  if (kind >= 500 && kind < 600) return 'cospre'
  if (kind === 600) return 'pet'
  return 'misc'
}

function getClass(classCode) {
  if (!classCode) return 'all'
  const last = classCode % 10
  return { 1: 'warrior', 2: 'rogue', 3: 'mage', 4: 'priest' }[last] || 'all'
}

function getNation(classCode) {
  if (!classCode) return 'all'
  if (classCode >= 100 && classCode < 200) return 'karus'
  if (classCode >= 200 && classCode < 300) return 'el_morad'
  return 'all'
}

// Try multiple TBL files
const TBL_FILES = [
  'D:\\NTTGame\\KnightOnlineEn\\Data\\item_org_us.tbl',
  'C:\\KO4FUNx64\\Data\\item_org_us.tbl',
]

const OUT_PATH = path.join(__dirname, 'msgko-app', 'lib', 'db', 'usko-items.json')

async function main() {
  let buffer = null
  let usedFile = null

  for (const f of TBL_FILES) {
    if (fs.existsSync(f)) {
      console.log('Reading:', f)
      buffer = fs.readFileSync(f)
      usedFile = f
      break
    }
  }

  if (!buffer) {
    console.error('No TBL file found!')
    process.exit(1)
  }

  console.log(`File size: ${buffer.length} bytes`)

  // Detect and decrypt
  let decrypted
  if (standardDetermine(buffer)) {
    console.log('Detected: standard encryption')
    decrypted = standardDecode(buffer)
  } else {
    // Try force decode with standard keys anyway
    console.log('Standard determine failed — trying force decode...')
    decrypted = standardDecode(Buffer.from(buffer))
    // Check if first int32 looks like a valid column count (1-200)
    const colCount = decrypted.readInt32LE(0)
    console.log('After decode, column count =', colCount)
    if (colCount < 1 || colCount > 500) {
      // Try double decode or alternative keys
      console.log('Trying alternative key variants...')
      const variants = [
        [0x0816, 0x6081, 0x1608],
        [0x5F2D, 0x5F2D, 0x0000],
        [0xA8F1, 0x3657, 0x4A29],
      ]
      let found = false
      for (const [k1, k2, k3] of variants) {
        const test = Buffer.from(buffer)
        let key1 = k1, key2 = k2, key3 = k3
        for (let i = 0; i < test.length; i++) {
          const data = test[i]
          test[i] = data ^ (key1 >> 8)
          key1 = ((data + key1) * key2 + key3) & 0xffff
        }
        const cc = test.readInt32LE(0)
        console.log(`  Keys ${k1.toString(16)}/${k2.toString(16)}/${k3.toString(16)} → colCount=${cc}`)
        if (cc > 0 && cc < 200) {
          decrypted = test
          found = true
          console.log('  Found valid decode!')
          break
        }
      }
      if (!found) {
        // Use raw file as-is and inspect
        decrypted = buffer
        console.log('Using raw buffer, will inspect structure...')
      }
    }
  }

  console.log('Parsing TBL...')
  const { columns, columnCount, rowCount, rows } = parseTBL(decrypted)
  console.log(`Columns: ${columnCount} | Rows: ${rowCount}`)
  console.log('Column types:', columns.slice(0, 10))

  // The first row columns map to item fields
  // Print first 3 rows raw to understand structure
  console.log('\nFirst 3 rows (raw):')
  rows.slice(0, 3).forEach((r, i) => {
    console.log(`  Row ${i}:`, JSON.stringify(r.slice(0, 8)))
  })

  // Map rows to items
  // item_org_us column order based on schema:
  // 0=Num, 1=strName, 2=Kind, 3=Slot, 4=Race, 5=Class, ...17=ReqLevel
  const items = []

  for (const row of rows) {
    const num = row[0]
    const strName = row[1]
    if (!num || !strName || typeof strName !== 'string' || strName.trim() === '') continue

    const kind = row[2] || 0
    const classCode = row[5] || 0
    const reqLevel = row[17] || 1
    const slot = getEquipmentSlotKey(kind)
    const itemType = getItemType(kind)

    items.push({
      item_id: num,
      item_name: strName.trim(),
      item_name_en: strName.trim(),
      item_type: itemType,
      kind,
      equipment_slot_key: slot,
      class_restriction: getClass(classCode),
      nation_restriction: getNation(classCode),
      req_level: reqLevel,
      icon_url: null,
      model_url: null,
    })
  }

  items.sort((a, b) => a.item_id - b.item_id)

  const dir = path.dirname(OUT_PATH)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(OUT_PATH, JSON.stringify(items, null, 2))

  console.log(`\nSaved ${items.length} items to: ${OUT_PATH}`)

  // Search for popular items
  console.log('\n--- Popular USKO items ---')
  const search = ['Shard', 'Mirage', 'Raptor', 'Chitin', 'Iron Bow', 'Lycaon', 'Glass Belt', 'Elven', 'Hepa']
  search.forEach(term => {
    const found = items.filter(i => i.item_name.toLowerCase().includes(term.toLowerCase()))
    if (found.length) {
      console.log(`\n"${term}" (${found.length} items):`)
      found.slice(0, 4).forEach(i => {
        console.log(`  [${i.item_id}] "${i.item_name}" | slot=${i.equipment_slot_key} | class=${i.class_restriction}`)
      })
    }
  })
}

main().catch(console.error)
