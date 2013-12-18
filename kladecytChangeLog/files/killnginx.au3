$sProcName = "nginx.exe"

While ProcessExists($sProcName)
    ProcessClose($sProcName)
WEnd