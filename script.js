//this file contains the code which is fetched by the bookmark and is run


let studentData = Array.from(document.getElementsByClassName('qRU9Ec')).filter(a=>!a.firstChild.innerText.includes('invited')).map(a=>{return{name:a.firstChild.innerText,student_id:a.lastChild.firstChild.firstChild.firstChild.attributes['aria-label'].value.toString().replace('Email','').replace('@edison.k12.nj.us','').trim()}})
console.log(studentData);
return studentData;