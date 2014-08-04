local table servers={}--stores all servers
portSide= "back"
serverFile="serverlist"
version="lookup1.0"
function getDeviceSide(deviceType)
  -- List of all sides
  local lstSides = {"left","right","top","bottom","front","back"};
  -- Now loop through all the sides
  for i, side in pairs(lstSides) do
    if (peripheral.isPresent(side)) then
      -- Yup, there is something on this side
      if (peripheral.getType(side) == string.lower(deviceType)) then
        -- Yes, this is the device type we need, so return the side
        return side
      end
    end
  end
  --nothing found, return nill
  return nil
end
portSide=getDeviceSide("modem")
if portSide==nil then
	print("error: no modem found")
end
function findServer(table, element)
  for key, value in pairs(table) do
    if value == element then
      return key
    end
  end
  return -1--would be 0, but 0 is a legitimate computer ID
end
function removeStuff(link)
	if string.len(link)>4 then
		if string.sub(link,1,4)=="www." then
		  link=string.sub(link,5,-1)
		end
		if string.sub(link,-4,-1)==".com" then
		  link=string.sub(link,1,-5)
		end
	end
	return link
end
function split(text,splitAt)
	state=false
	outA=""
	outB=""
	for i=1,string.len(text) do 
		if string.sub(text,i,i)==splitAt then
			state=true
		end
		if state==false then
			outA=outA..string.sub(text,i,i)
		else
			outB=outB..string.sub(text,i,i)
		end
	end
	outB=string.sub(outB,2,-1)--remove first char (= to splitAt)
	return outA,outB
end
rednet.open(portSide)
term.clear()
term.setCursorPos(1,1)
print(version)
print("dedicated dns (ddns) for dynet")
if not fs.exists(serverFile) then
	print("creating server list")
	file=fs.open(serverFile,"w")--create file
	file.write("{}")
	file.close()
else
	print("loading server list")
	file=fs.open(serverFile,"r")
	servers=textutils.unserialize(file.readAll())
	file.close()
end
print("lookup server started")

while true do
	from,data=rednet.receive()
	command,argument=split(data," ")
	print("received "..command.." and "..argument)--TODO remove this
	if string.sub(data,1,1)=="@" then--if it's a global command
		command=string.sub(command,2,-1)--remove global identifier
		if command=="ddns" then--is there a dedicated dns?
			rednet.send(from,version)--reply with version
		elseif command=="whois" then
			--TODO: check if from and form2 match
			--argument=removeStuff(argument)
			result=findServer(servers,argument)
			rednet.send(from,result)
			print("whois from "..from.." for "..argument..",sent "..result)--log request
		elseif command=="whoisid" then
			result=servers[argument..""]
			if result==nil then result=" "
			else rednet.send(from,result) end
			print("whoisid from "..from.." for "..argument..",sent "..result)
		elseif command=="addserver" then
			argument=removeStuff(argument)
			servers[tostring(from)]=argument
			--print("adding "..from.." as "..argument)--log request
			--save it to a file
			file=fs.open(serverFile,"w")
			file.write(textutils.serialize(servers))
			file.close()
		end
	else
		print("WARNING: received "..data)--just a warning, no using broadcasts without @
	end
	
end