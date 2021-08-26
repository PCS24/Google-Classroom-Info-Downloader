//this file contains the code which is fetched by the bookmark and is run

let studentData = Array.from(document.getElementsByClassName('qRU9Ec')).filter(a=>!a.firstChild.innerText.includes('invited')).map(a=>{return{name:a.firstChild.innerText,student_id:a.lastChild.firstChild.firstChild.firstChild.attributes['aria-label'].value.toString().replace('Email','').replace('@edison.k12.nj.us','').trim()}})
console.log(studentData);

//try to click view more'
try{
    Array.from(document.getElementsByClassName('NPEfkd RveJvd snByac')).filter((element) => element.innerText == "View all")[0].click();
}catch(e){
    console.log(e);
}

let teacherData = Array.from(document.getElementsByClassName('sCv5Q asQXV')).filter(a=>a.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.style[0]!="display").map((a, index)=>{return{name: a.innerText, owner: index==0}});
console.log(teacherData);
 let userData = Array.from(document.getElementsByClassName('gb_C gb_Ma gb_h'))[0].attributes['aria-label'].value.replace('Google Account:','').replace('\n','').replace('(','').replace(')','').replace('@edison.k12.nj.us','').split('  ').filter(Boolean).map(a=>a.trim());

 studentData.push({
     name:userData[0],
     student_id:userData[1]
 });

 const finalData = {
    teachers:teacherData,
    students:studentData,

}

document.body.parentElement.removeChild(document.body);
document.body = document.createElement('body');
document.head.parentElement.removeChild(document.head);
async function main(){
    await fetch('https://raw.githubusercontent.com/PCS24/Google-Classroom-Info-Downloader/feat/scrape-names/prompt.html').then((res)=>(res.text().then((a)=>(document.body.innerHTML=a))));
    finalData.is_hr_class = await newyesno('Is this a homeroom class?').catch(console.error);
    console.log(finalData);
    
}
main().then(()=>console.log(finalData));
/*
if(prompt("is this a Homeroom class? (yes or no)").toLowerCase() != 'yes'){
 finalData.is_hr_class = false;
    if(prompt('Is this class only for one period? (yes or no)').toLowerCase()=='no'){

    finalData.startpd = getNumber('What period does your class start?',12,1)
    finalData.endpd = getNumber('What period does your class end?',12,1)
   
}else{
    finalData.class_period=getNumber('What period is your class',12,1);
}
if(prompt("is this class for the whole year? (yes or no)").toLowerCase()=='no'){
    finalData.marking_period = getNumber('What marking period is your class? (5 for 1st semester, 6 for second)',6,1);
    finalData.is_quarterly_class = true;
}else{
    finalData.is_quarterly_class = false;
}
}else{
    finalData.is_hr_class = true;
}
console.log(finalData);


function getNumber(question,upper,lower){

    let rt = null;
    do{
    rt = prompt(question);
    
    rt = parseInt(rt);
    if(rt>upper||rt<lower){
        rt = NaN;
    }
    }while(isNaN(rt))
    return rt;
}
*/

function newyesno(question){
   return new Promise((resolve, reject) => {
    let div = document.getElementById('yes-no-question');
    let form = document.getElementById('form1')
    div.hidden = false;
    form.innerText = question;
    form.onsubmit = ()=>{
        let options = Array.from(form.children).filter(a=>a instanceof HTMLInputElement)
        let ans = options.find(a=> a.checked);
        if (ans == undefined) {
            reject();
            return;    
        }
        resolve(ans.value);
        div.hidden = true;

    }    
})

}



function onclic(){
    console.log('it works')
}