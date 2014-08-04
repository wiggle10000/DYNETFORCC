
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
			rednet.send(from,getDynamicLine(line,dats))
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
if(arg[2]==nil) then
	ddns=true
	else
	ddns=false
	end
rednet.open(portSide)
--TODO fix crashes on page not found etc.
--term.clear()
--term.setCursorPos(1,1)

--OLDCODE1 goes here--

print("webserver started")
while true do
from,data=rednet.receive()
if string.sub(data,1,1)=="/" then--web page
	print("page "..data.." requested by "..from)
	webText=""
	--term.write("debug: "..webText)
	if fs.exists(pageFolder..data) then
		sendPage(pageFolder..data,from)
	elseif sendDynamicPage~=nil then
		sendDynamicPage(data,from)
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
				runDynamicCommand(link,from,data)
			else
				rednet.send(from,link)--normal link
			end
		end
	elseif sendDynamicPageCommand~=nil then
		sendDynamicPageCommand(page,line,from)
	end
elseif string.sub(data,1,6)=="@whois" and ddns==false then
	data=string.sub(data,8,-1)--remove @whois and space
	data=removeStuff(data)--remove www. and things
	print("whois recieved for: "..data)
	if data==arg[2] then
		print("whois for this site from "..from.." (local dns),sending "..os.getComputerID())
		rednet.send(from,os.getComputerID())
	end
elseif string.sub(data,1,4)=="ans:" then
	data=string.sub(data,5,-1)--remove ans
	cookie,answer=split(data,":")
	takeDynamicInput(cookie,from,answer)--do something with recieved information
	rednet.send(from,"ref")--refresh client as soon as it is done
end
if data=="version" then
	rednet.send(from,version)
end
end
