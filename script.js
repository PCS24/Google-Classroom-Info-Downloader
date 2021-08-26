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
    document.getElementById('hrnum').onkeyup = function(){
        let inp = document.getElementById('hrnum');
        let value = parseInt(document.getElementById('hrnum').value);
        if(isNaN(value)){
            bad();
            
        }else if(value>26){
            bad();
            
        }else if(value<1){
            bad();
        }else if(document.getElementById('hrnum').value.includes('-')){
            bad();
        }else{
            good();
        }
        function bad(){
            console.log(document.getElementById('hrnum').value);

           inp.className.includes('error')?true :inp.className+= ' error';
            document.getElementById('hrsub').hidden = true;
            
        }
        function good(){
            console.log(document.getElementById('hrnum').value);
           inp.className =  inp.className.replace(' error','');
           inp.className =  inp.className.replace(' error','');
            document.getElementById('hrsub').hidden = false;

        }
    }
    
    finalData.is_hr_class = await newyesno('Is this a homeroom class?').catch(console.error);
    console.log(finalData);
    if(finalData.is_hr_class){
        let hrQuestion = document.getElementById('hr-question');
        hrQuestion.hidden = false;
        let form = hrQuestion.firstChild;
        finalData.hr_num = await new Promise((resolve, reject) => {

        form.onsubmit = (e)=>{
            e.preventDefault();
            
            resolve(parseInt(document.getElementById('hrnum').value));
            hrQuestion.hidden = true;
    
        }
    });
        //add download
        return;
    }else{
        let mpQuestion = document.getElementById('mp-question');
        mpQuestion.hidden = false;
        let form = mpQuestion.firstChild;
        finalData.marking_period = await new Promise((resolve, reject) => {
        
            form.onsubmit = (e)=>{
                e.preventDefault();
                let options = Array.from(form.children).filter(a=>a instanceof HTMLInputElement)
                let ans = options.find(a=> a.checked);
                if (ans == undefined) {
                    reject();
                    return;    
                }
                resolve(ans.value);
                mpQuestion.hidden = true;
        
            }    
        })
        let pdQuestion = document.getElementById('pd-question');
        pdQuestion.hidden = false;
        form = pdQuestion.firstChild;
        finalData.class_period = await new Promise((resolve, reject) => {
        
            form.onsubmit = (e)=>{
                e.preventDefault();
                let options = Array.from(form.children).filter(a=>a instanceof HTMLInputElement)
                let ans = options.find(a=> a.checked);
                if (ans == undefined) {
                    reject();
                    return;    
                }
                resolve(ans.value);
                pdQuestion.hidden = true;
        
            }    
        })
        //add download
        return;
    }

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
    document.getElementById('yes-no-title').innerText = question;
    form.onsubmit = (e)=>{
        e.preventDefault();
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