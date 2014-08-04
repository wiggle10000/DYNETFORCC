function askUser(client,cookie,question)
	rednet.send(client,"ask:"..cookie..":"..question)
end
function refresh(client)
	rednet.send(client,"ref")
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
