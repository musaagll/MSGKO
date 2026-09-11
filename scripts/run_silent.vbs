Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "cmd /c set PYTHONUTF8=1 && C:\Users\kajde\AppData\Local\Programs\Python\Python312\python.exe -X utf8 """ & WScript.ScriptFullName & """\..\scrape_market.py"" >> """ & WScript.ScriptFullName & """\..\last_run.log"" 2>&1", 0, False
