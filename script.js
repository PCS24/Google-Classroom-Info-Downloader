//this file contains the code which is fetched by the bookmark and is run


let studentData = Array.from(document.getElementsByClassName('qRU9Ec')).filter(a=>!a.firstChild.innerText.includes('invited')).map(a=>{return{name:a.firstChild.innerText,student_id:a.lastChild.firstChild.firstChild.firstChild.attributes['aria-label'].value.toString().replace('Email','').replace('@edison.k12.nj.us','').trim()}})
console.log(studentData);

//try to click view more'
try{
    Array.from(document.getElementsByClassName('NPEfkd RveJvd snByac')).filter((element) => element.innerText == "View all")[0].click();
}catch(e){
    console.log(e);
}

let teacherData = Array.from(document.getElementsByClassName('ycbm1d')).filter(a=>!a.firstChild.innerText.includes('invited')).map(a=>{return{name:a.firstChild.firstChild.lastChild.innerText,student_id:a.lastChild.lastChild.firstChild.firstChild.attributes['aria-label'].value.toString().replace('Email','').replace('@edison.k12.nj.us','').trim()}}).map((a,index)=>{if(index == 0){a.owner = true}else{a.owner=false} return a});
console.log(teacherData);
