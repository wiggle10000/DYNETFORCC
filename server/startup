--taken from http://www.computercraft.info/forums2/index.php?/topic/14252-151codesnippet-auto-detect-peripheral-side/
local function getDeviceSide(deviceType)
  -- List of all sides
  local lstSides = {"left","right","top","bottom","front","back"};
  -- Now loop through all the sides
  for i, side in pairs(lstSides) do
    if (peripheral.isPresent(side)) then
      -- Yup, there is something on this side
      if (peripheral.getType(side) == string.lower(deviceType)) then
        -- Yes, this is the device type we need, so return the side
        return side;
      end
    end
  end
  --nothing found, return nill
  return nil;
end
local function getFile(filename)
	if not fs.exists(filename) then return nil end
	local rfile=fs.open(filename,"r")
	result=rfile.readAll()
	rfile.close()
	return result
end
--end functions
print("assembling server")
file=fs.open("server","w")
file.write(getFile("filestart").."\n"..getFile("site/dynamic").."\n"..getFile("core"))
file.close()
print("finding port")
settings=fs.open("settings","r")
name=settings.readLine()
side=settings.readLine()
settings.close()
	if side==nil then
	side=getDeviceSide("modem")
	if side==nil then
	print("ERROR: no modem connected!")
	else
	print("no default, using "..side.." modem")
	end
end
if name=="" or name==nil then
	print("running with ddns")
	name=nil
end
shell.run("server",side,name)