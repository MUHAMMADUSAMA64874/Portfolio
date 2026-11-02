/* This script and many more are available free online at
The JavaScript Source!! http://javascript.internet.com
Created by: Mr J | http://www.huntingground.net/ */

scrollStep=1

timerLeft=""
timerRight=""

function toLeft(id){
  document.getElementById(id).scrollLeft=0
}

function scrollDivLeft(id){
  clearTimeout(timerRight) 
  document.getElementById(id).scrollLeft+=scrollStep
  timerRight=setTimeout("scrollDivLeft('"+id+"')",10)
}

function scrollDivRight(id){
  clearTimeout(timerLeft)
  document.getElementById(id).scrollLeft-=scrollStep
  timerLeft=setTimeout("scrollDivRight('"+id+"')",10)
}

function toRight(id){
  document.getElementById(id).scrollLeft=document.getElementById(id).scrollWidth
}

function stopMe(){
  clearTimeout(timerRight) 
  clearTimeout(timerLeft)
}

