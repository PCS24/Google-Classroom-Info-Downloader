javascript:
/* this file contains the code which is fetched by the bookmark and is run */

/* get student data */
var studentData = Array.from(document.getElementsByClassName('qRU9Ec')).filter(a=>!a.firstChild.innerText.includes('invited')).map(a=>{return{name:a.firstChild.innerText,student_id:parseInt(a.lastChild.firstChild.lastChild.innerText.toString().replace('Email','').replace('@edison.k12.nj.us','').trim())}});
console.log(studentData);

/* try to click view more */
try{
    Array.from(document.getElementsByClassName('NPEfkd RveJvd snByac')).filter((element) => element.innerText == "View all")[0].click();
}catch(e){
    console.log("Unable to locate or click a \"View more\" button");
    console.log(e);
}

/* get teacher data */
var teacherData = Array.from(document.getElementsByClassName('sCv5Q asQXV')).filter(a=>a.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.style.visibility!=='hidden').map((a, index)=>{return{name: a.innerText, owner: index==0}});
console.log(teacherData);

/* get data about the person that is scraping */
/* var userData = Array.from(document.getElementsByClassName('gb_C gb_Ma gb_h'))[0].attributes['aria-label'].value.replace('Google Account:','').replace('\n','').replace('(','').replace(')','').replace('@edison.k12.nj.us','').split('  ').filter(Boolean).map(a=>a.trim()); */
var userData = document.getElementsByClassName('gb_de')[0]; 

studentData.push({
    name: userData.children[1].innerText,
    student_id: parseInt(userData.children[2].innerText)
});

var finalData = {
    teachers:teacherData,
    students:studentData,

};
var title = document.title;

/* replace the page with questions */
document.body.parentElement.removeChild(document.body);
document.body = document.createElement('body');
document.head.parentElement.removeChild(document.head);
async function main(){
  
    await fetch('https://raw.githubusercontent.com/PCS24/Google-Classroom-Info-Downloader/main/prompt.html').then((res)=>(res.text().then((a)=>(document.body.innerHTML=a))));
    /* input validation */
    document.getElementById('hrnum').onkeyup = function(){
        let inp = document.getElementById('hrnum');
        let value = document.getElementById('hrnum').value;
        if (isNaN(value)) {
            bad();
            
        } else if (value>26) {
            bad();
            
        } else if (value<1) {
            bad();
        } else if (document.getElementById('hrnum').value.includes('-')) {
            bad();
        } else {
            good();
        }
        function bad(){
            /* console.log(document.getElementById('hrnum').value); */

            inp.className.includes('error')?undefined:inp.className+= ' error';
            document.getElementById('hrsub').hidden = true;
            
        }
        function good(){
            /* console.log(document.getElementById('hrnum').value); */
            inp.className =  inp.className.replace(' error','');
            inp.className =  inp.className.replace(' error','');
            document.getElementById('hrsub').hidden = false;

        }
    };
    /* ask is hr question */
    finalData.is_hr_class = await newyesno('Is this a homeroom class?').catch(console.error);
    console.log(finalData);
    finalData.is_hr_class = finalData.is_hr_class.toLowerCase()=="yes"?true:false;
    if(finalData.is_hr_class){
        /* ask which hr */
        let hrQuestion = document.getElementById('hr-question');
        hrQuestion.hidden = false;
        let form = document.getElementById('form4');
        finalData.hr_num = await new Promise((resolve, reject) => {

        form.onsubmit = (e)=>{
            e.preventDefault();
            
            resolve(parseInt(document.getElementById('hrnum').value));
            hrQuestion.hidden = true;
    
        }
    });

        return;
    }else{
        /* ask mp question */
        let mpQuestion = document.getElementById('mp-question');
        mpQuestion.hidden = false;
        let form = document.getElementById('form3');
        finalData.marking_period = await new Promise((resolve, reject) => {
        
            form.onsubmit = (e)=>{
                e.preventDefault();
                let options = Array.from(form.children).filter(a=>a instanceof HTMLInputElement);
                let ans = options.find(a=> a.checked);
                if (ans == undefined) {
                    reject();
                    return;    
                }
                resolve(parseInt(ans.value));
                mpQuestion.hidden = true;
        
            }    
        });
        /* ask pd question */
        let pdQuestion = document.getElementById('pd-question');
        pdQuestion.hidden = false;
        form = document.getElementById('form2');
        finalData.class_period = await new Promise((resolve, reject) => {
        
            form.onsubmit = (e)=>{
                e.preventDefault();
                let dropmenu = Array.from(form.children).filter(a=>a instanceof HTMLSelectElement)[0];
                resolve(dropmenu.value);
                mpQuestion.hidden = true;
            }
        });
        
            finalData.start_period = parseInt(finalData.class_period.split('/')[0]);
            finalData.end_period = parseInt(finalData.class_period.split('/')[finalData.class_period.split('/').length-1]);
            delete finalData.class_period;
        
            
        return;
    }

}
main().then(()=>{
    save(JSON.stringify(finalData), `classdata-${title}.json`, "text/plain;charset=utf-8");
    setTimeout(function () {
        /* reload page after 1 sec */
        window.location.reload();
    }, 1000);
}).catch(console.error);

function save(data, filename, type) {
    /* https://stackoverflow.com/a/30832210 */
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) /* IE10+ */
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { /* Others */
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}

function newyesno(question){
   return new Promise((resolve, reject) => {
    let div = document.getElementById('yes-no-question');
    let form = document.getElementById('form1');
    div.hidden = false;
    document.getElementById('yes-no-title').innerText = question;
    form.onsubmit = (e)=>{
        e.preventDefault();
        let options = Array.from(form.children).filter(a=>a instanceof HTMLInputElement);
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

