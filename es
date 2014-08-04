local args={...}--command line arguments
pageName=args[1] or "disk/site/home"
term.clear()
function getColour(value)
	--TODO prevent crashing on invalid number
	number=tonumber(value)
	if number==nil then--convert hexadecimal
		if value=="A" then
			number=10
		elseif value=="B" then
			number=11
		elseif value=="C" then
			number=12
		elseif value=="D" then
			number=13
		elseif value=="E" then
			number=14
		elseif value=="F" then
			number=15
		else
			return colours.black
		end
	end
	return bit.blshift(1,number)
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
function readFile(name)
	file=fs.open(name,"r")--read page
	output=file.readAll()
	file.close()
	return output
end

function render(pagetext)
	line=1
	term.setCursorPos(2,line)
	colourmode=0--1=^ detected 2=nextchar text 3=nextchar backround
	term.setBackgroundColor(colours.white)
	term.setTextColor(colours.black)
	for current=1,string.len(pagetext) do
		letter=string.sub(pagetext,current,current)--TODO surely an easier way?
		if letter==nil then letter=" " end
		if colourmode==0 then --normal
			if letter=="^" then 
				colourmode=1
			elseif letter=="\n" then
				line=line+1--next line
				if line==17 then break end--too much! TODO tweak this value
				term.setCursorPos(2,line)
				term.setBackgroundColor(colours.white)
				term.setTextColor(colours.black)--reset colours for next line
			else
				term.write(letter)--nothing special
			end
		elseif colourmode==1 then --might be a colour
			if letter=="f" then--foreground colour
				colourmode=2--next char will set foreground
			elseif letter=="b" then--background colour
				colourmode=3--next char will set background
			else--not correct, probably not intended as a colour
				term.write("^"..letter)--put ^ back as well
			end
		elseif colourmode==2 then--set text colour
			--print(letter)--debug
			term.setTextColor(getColour(letter))
			colourmode=0--back to normal
		elseif colourmode==3 then--set background colour
			term.setBackgroundColor(getColour(letter))
			colourmode=0--back to normal
		end
	end
end
function renderLine(pageText,line)
	term.setCursorPos(2,line)
	colourmode=0--1=^ detected 2=nextchar text 3=nextchar backround
	term.setBackgroundColor(colours.white)
	term.setTextColor(colours.black)
	for current=1,string.len(pagetext) do
		letter=string.sub(pagetext,current,current)--TODO surely an easier way?
		if letter==nil then letter=" " end
		if colourmode==0 then --normal
			if letter=="^" then 
				colourmode=1
			elseif letter=="\n" then
				line=line+1--next line
				if line==17 then break end--too much! TODO tweak this value
				term.setCursorPos(2,line)
				term.setBackgroundColor(colours.white)
				term.setTextColor(colours.black)--reset colours for next line
			else
				term.write(letter)--nothing special
			end
		elseif colourmode==1 then --might be a colour
			if letter=="f" then--foreground colour
				colourmode=2--next char will set foreground
			elseif letter=="b" then--background colour
				colourmode=3--next char will set background
			else--not correct, probably not intended as a colour
				term.write("^"..letter)--put ^ back as well
			end
		elseif colourmode==2 then--set text colour
			--print(letter)--debug
			term.setTextColor(getColour(letter))
			colourmode=0--back to normal
		elseif colourmode==3 then--set background colour
			term.setBackgroundColor(getColour(letter))
			colourmode=0--back to normal
		end
	end
end
function renderGUI()
	term.setBackgroundColor(colours.white)
	term.setTextColour(colours.lightGrey)
	term.clear()
	for colour=0,15 do
		term.setBackgroundColor(bit.blshift(1,colour))
		term.setCursorPos(1,colour+1)
		term.write("*")
		term.setTextColour(colours.white)
	end
	term.setBackgroundColor(colours.lightGrey)
	term.setTextColor(colours.white)
	term.setCursorPos(1,17)
	term.write("B")
	term.setCursorPos(1,18)
	term.write("T")
end
renderGUI()
render(readFile(pageName))