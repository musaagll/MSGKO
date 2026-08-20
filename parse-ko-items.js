// ============================================================
// Knight Online Item Database Parser
// Source: ko4life-net/ko-db (MIT License)
// Downloads ITEM.sql and converts to MSGKO format JSON
// ============================================================

const https = require('https')
const fs = require('fs')
const path = require('path')

const ITEM_SQL_URL = 'https://raw.githubusercontent.com/ko4life-net/ko-db/master/src/data/ITEM.sql'
const OUT_PATH = path.join(__dirname, 'msgko-app', 'lib', 'db', 'ko-items.json')

// KO Slot mapping (from schema analysis)
const SLOT_MAP = {
  0:  'right_hand',  // weapon main hand
  1:  'left_hand',   // weapon off hand / shield
  2:  'helmet',
  3:  'pauldron',
  4:  'gloves',
  5:  'boots',
  6:  'pads',
  7:  'ring',
  8:  'necklace',
  9:  'earring',
  10: 'wings',
  11: 'pet',
}

// KO Kind (item type) mapping
const KIND_MAP = {
  10: 'dagger',
  20: 'sword',
  21: 'two_hand_sword',
  30: 'axe',
  31: 'two_hand_axe',
  40: 'mace',
  41: 'two_hand_mace',
  50: 'spear',
  60: 'bow',
  70: 'staff',
  110: 'helmet',
  120: 'pauldron',
  130: 'pads',
  140: 'gloves',
  150: 'boots',
  160: 'shield',
  210: 'ring',
  220: 'necklace',
  230: 'earring',
  510: 'cospre',
  600: 'pet',
}

// KO Class mapping
const CLASS_MAP = {
  0:   'all',
  101: 'warrior_karus',
  102: 'rogue_karus',
  103: 'mage_karus',
  104: 'priest_karus',
  201: 'warrior_elmorad',
  202: 'rogue_elmorad',
  203: 'mage_elmorad',
  204: 'priest_elmorad',
}

function getClass(classCode) {
  if (classCode === 0) return 'all'
  const str = String(classCode)
  const last = parseInt(str[str.length - 1])
  const classes = { 1: 'warrior', 2: 'rogue', 3: 'mage', 4: 'priest' }
  return classes[last] || 'all'
}

function getNation(classCode) {
  if (classCode === 0) return 'all'
  const code = parseInt(classCode)
  if (code >= 100 && code < 200) return 'karus'
  if (code >= 200 && code < 300) return 'el_morad'
  return 'all'
}

function getItemType(kind) {
  const k = parseInt(kind)
  if (k >= 10 && k < 100) return 'weapon'
  if (k >= 110 && k < 200) return 'armor'
  if (k >= 200 && k < 300) return 'accessory'
  if (k === 510) return 'cospre'
  if (k === 600) return 'pet'
  return 'misc'
}

function getEquipmentSlotKey(kind, slot) {
  const k = parseInt(kind)
  const s = parseInt(slot)
  // Armor pieces
  if (k === 110) return 'HELMET'
  if (k === 120) return 'ARMOR'
  if (k === 130) return 'PADS'
  if (k === 140) return 'GLOVES'
  if (k === 150) return 'BOOTS'
  if (k === 160) return 'LEFT_HAND'   // shield
  // Weapons
  if (k >= 10 && k < 100) return s === 1 ? 'LEFT_HAND' : 'RIGHT_HAND'
  // Accessories
  if (k === 210) return 'RING_1'
  if (k === 220) return 'NECKLACE'
  if (k === 230) return 'EARRING_1'
  // Special
  if (k === 510) return 'WINGS'
  if (k === 600) return 'PET'
  return null
}

// Parse a single INSERT line
function parseLine(line) {
  // Extract VALUES (...)
  const match = line.match(/VALUES\s*\((.+)\)\s*$/)
  if (!match) return null

  const raw = match[1]
  const values = []
  let current = ''
  let inString = false
  let i = 0

  while (i < raw.length) {
    const ch = raw[i]
    // Handle N'string' format
    if (ch === 'N' && raw[i+1] === "'") {
      inString = true
      i += 2 // skip N'
      continue
    }
    if (ch === "'" && inString) {
      // Check for escaped quote ''
      if (raw[i+1] === "'") {
        current += "'"
        i += 2
        continue
      }
      inString = false
      i++
      continue
    }
    if (ch === ',' && !inString) {
      values.push(current.trim())
      current = ''
      i++
      continue
    }
    current += ch
    i++
  }
  if (current) values.push(current.trim())

  if (values.length < 4) return null

  const num = parseInt(values[0])
  const strName = values[1]
  const kind = parseInt(values[2])
  const slot = parseInt(values[3])
  const race = parseInt(values[4]) || 0
  const classCode = parseInt(values[5]) || 0
  const reqLevel = parseInt(values[17]) || 1

  if (!num || !strName || strName === '' || strName === '0') return null

  const equipSlotKey = getEquipmentSlotKey(kind, slot)
  const itemType = getItemType(kind)
  const charClass = getClass(classCode)
  const nation = getNation(classCode)

  return {
    item_id: num,
    item_name: strName,
    item_name_en: strName,
    item_type: itemType,
    kind: kind,
    equipment_slot_key: equipSlotKey,
    class_restriction: charClass,
    nation_restriction: nation,
    req_level: reqLevel,
    // Icons will be mapped separately when available
    icon_url: null,
    model_url: null,
  }
}

async function downloadAndParse() {
  console.log('Downloading ITEM.sql from ko4life-net/ko-db...')

  return new Promise((resolve, reject) => {
    https.get(ITEM_SQL_URL, (res) => {
      let data = ''
      res.on('data', chunk => { data += chunk })
      res.on('end', () => {
        console.log(`Downloaded ${data.length} bytes`)

        const lines = data.split('\n')
        const items = []
        let parsed = 0
        let skipped = 0

        for (const line of lines) {
          if (!line.trim().startsWith('INSERT')) continue
          const item = parseLine(line.trim())
          if (item) {
            items.push(item)
            parsed++
          } else {
            skipped++
          }
        }

        console.log(`Parsed: ${parsed} items | Skipped: ${skipped} lines`)

        // Sort by item_id
        items.sort((a, b) => a.item_id - b.item_id)

        // Write JSON
        const dir = path.dirname(OUT_PATH)
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
        fs.writeFileSync(OUT_PATH, JSON.stringify(items, null, 2))
        console.log(`Saved to: ${OUT_PATH}`)
        console.log(`Total items: ${items.length}`)

        // Print sample
        console.log('\nSample items:')
        items.slice(0, 5).forEach(i => {
          console.log(`  [${i.item_id}] ${i.item_name} | type=${i.item_type} | slot=${i.equipment_slot_key} | class=${i.class_restriction}`)
        })

        // Find popular items
        const popular = ['Shard', 'Mirage', 'Raptor', 'Iron Bow', 'Chitin', 'Glass Belt', 'Lycaon']
        console.log('\nPopular KO items found:')
        popular.forEach(name => {
          const found = items.filter(i => i.item_name.toLowerCase().includes(name.toLowerCase()))
          if (found.length > 0) {
            console.log(`  "${name}": ${found.length} items`)
            found.slice(0, 2).forEach(i => {
              console.log(`    [${i.item_id}] ${i.item_name} | slot=${i.equipment_slot_key} | class=${i.class_restriction}`)
            })
          }
        })

        resolve(items)
      })
      res.on('error', reject)
    }).on('error', reject)
  })
}

downloadAndParse().catch(console.error)
