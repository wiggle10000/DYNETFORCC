function getDynamicLine(name)
  --add custom output functions here (server-->client)
	if name=="disk" then
		if disk.isPresent("left") then
			return "currently has: "..disk.getAudioTitle("left")
		else
			return "no disk"
		end
  end
end
function runDynamicCommand(name,client)
	--add custom input functions here(server<--client)
	if name=="eject" then
		disk.eject("left")
		rednet.send(client,"ref")--ask to refresh the page
	end
	if name=="play" then
		disk.playAudio("left")
	end
	if name=="stop" then
		disk.stopAudio("left")
	end
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
function sendPage(directory,from)
	file=fs.open(directory,"r")--read page
	for currentLine=1,17 do--TODO: try make this 18?
		line=file.readLine()
		--prevent crashing on empty line:
		if line==nil then
			line=" "
		end
		if webtext==nil then
			webtext=" "
		end
		--print("debug: "..line)
		line,_=split(line,"~")--remove line's command
		if string.sub(line,1,1)=="$" then--dynamic command
			line=string.sub(line,2,-1)--remove $
			--webtext=webtext..getDynamicLine(line).."\n "
			rednet.send(from,getDynamicLine(line))
		else
			--webtext=webtext..line.." \n "
			rednet.send(from,line)
		end
	end
	--webtext=webtext.." "
	--textutils.slowPrint(webtext)--TODO remove this debug
	file.close()
end
---------------------------
--server code starts here--
---------------------------
local arg={...}--command line arguments
portSide=arg[1] or "back"
version="web1.0"
pageFolder="site"
ddns=true
rednet.open(portSide)
--TODO fix crashes on page not found etc.
--term.clear()
--term.setCursorPos(1,1)
sleep(1)--give the ddns server some time so start up
rednet.broadcast("@ddns")--search for dedicated dns
ddnsID,result=rednet.receive(1)
if result==nil then--no ddns
	if arg[2]==nil then
		print("ERROR:")
		print("no ddns and no name defined!")
		print("either start a ddns computer")
		print("or name the site in the settings file")
		print("see manual for details")
		exit()
	else
		print("no ddns found, hosting domain as "..arg[2])
	ddns=false
	end
else--ddns found
	print("ddns found found with ID "..ddnsID)
	rednet.send(ddnsID,"@whoisid "..os.getComputerID())
	_,name=rednet.receive(1)
	if name==nil then
		print("server not found on ddns server!")
		print("enter a website name:")
		name=io.read()
		rednet.send(ddnsID,"@addserver "..name)
		rednet.send(ddnsID,"@whoisid "..os.getComputerID())
		_,name=rednet.receive(1)
	end
	print("registered as "..name.." on ddns")
end
print("webserver started")
while true do
from,data=rednet.receive()
if string.sub(data,1,1)=="/" then--web page
	print("page "..data.." requested by "..from)
	webText=""
	--term.write("debug: "..webText)
	if fs.exists(pageFolder..data) then
		sendPage(pageFolder..data,from)
	elseif fs.exists(pageFolder.."404") then--page not found
		sendPage(pageFolder.."404",from)
	else--404: 404 page not found
		rednet.send(from,"ERROR: the page was not found/doesn't exist")
		rednet.send(from,"in addition, a 404 error page was not found either")
	end
	
	
elseif string.sub(data,1,5)=="exec:" then--page link (no spaces)
	data=string.sub(data,6,-1)--remove exec thing
	page,line=split(data,":")--seperate page and data
	print(from.." selected line "..line.." on page "..page)
	line=tonumber(line)
	if fs.exists(pageFolder..page) then
		file=fs.open(pageFolder..page,"r")--read page
		for i=1,line-1 do
			_=file.readLine()--wait until we get to the line we need
		end
		--if line exists(prevent crash)
		line=file.readLine()
		if line~=nil then
			_,link=split(line,"~")--extract the command
			if string.sub(link,1,1)=="$" then--dynamic page
				link=string.sub(link,2,-1)
				runDynamicCommand(link,from)
			else
				rednet.send(from,link)--normal link
			end
		end
	end
elseif string.sub(data,1,6)=="@whois" and ddns==false then
	data=string.sub(data,8,-1)--remove @whois and space
	data=removeStuff(data)--remove www. and things
	print("whois recieved for: "..data)
	if data==arg[2] then
		print("whois for this site from "..from.." (local dns),sending "..os.getComputerID())
		rednet.send(from,os.getComputerID())
	end
end
if data=="version" then
	rednet.send(from,version)
end
end