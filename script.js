javascript:

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
    
    /*
    await fetch('https://raw.githubusercontent.com/PCS24/Google-Classroom-Info-Downloader/main/prompt.html').then((res)=>(res.text().then((a)=>(document.body.innerHTML=a))));
    */

    setupPrompts();

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

function setupPrompts() {

    const CSS_URL = "https://raw.githubusercontent.com/PCS24/Google-Classroom-Info-Downloader/main/prompt.css";
    let tmp;

    /* Clear existing content */
    document.body.remove();
    document.body = document.createElement('body');
    const body = document.body;

    /* CSS */
    fetch(CSS_URL).then((res)=>res.text()).then((res)=>{tmp = createChild(body, 'style'); tmp.innerText = res;});

    /* Logo image */
    tmp = document.createElement('img');
    tmp.setAttribute('src', 'https://avatars.githubusercontent.com/u/85776833?s=2400&v=4');
    tmp.setAttribute('class', 'center');
    tmp.style.maxHeight = '200px';
    tmp.style.maxWidth = '200px';
    body.appendChild(tmp);

    /* Main div */
    const mainDiv = document.createElement('div');
    mainDiv.setAttribute('class', 'center');
    body.appendChild(mainDiv);
    
    /* yes/no question div */
    const yesNoDiv = document.createElement('div');
    yesNoDiv.setAttribute('id', 'yes-no-question');
    yesNoDiv.setAttribute('class', 'question');
    yesNoDiv.setAttribute('hidden', 'true');
    mainDiv.appendChild(yesNoDiv);

        /* Form tag */
        const form1 = document.createElement('form');
        form1.setAttribute('id', 'form1');
        yesNoDiv.appendChild(form1);

        /* b element */
        tmp = document.createElement('b');
        tmp.setAttribute('id', 'yes-no-title');
        tmp.innerText = 'yes/no question';
        form1.appendChild(tmp);

        /* br */
        form1.appendChild(document.createElement('br'));

        /* input 1 */
        tmp = document.createElement('input');
        tmp.setAttribute('type', 'radio');
        tmp.setAttribute('id', 'question1-yes');
        tmp.setAttribute('value', 'Yes');
        tmp.setAttribute('name', 'question1');
        form1.appendChild(tmp);

        /* input 1 label */
        tmp = document.createElement('label');
        tmp.setAttribute('for', 'question1-yes');
        tmp.innerText = 'Yes';
        form1.appendChild(tmp);

        /* br */
        form1.appendChild(document.createElement('br'));

        /* input 2 */
        tmp = document.createElement('input');
        tmp.setAttribute('type', 'radio');
        tmp.setAttribute('id', 'question1-no');
        tmp.setAttribute('value', 'No');
        tmp.setAttribute('name', 'question1');
        form1.appendChild(tmp);

        /* input 2 label */
        tmp = document.createElement('label');
        tmp.setAttribute('for', 'question1-no');
        tmp.innerText = 'No';
        form1.appendChild(tmp);

        /* br x2 */
        form1.appendChild(document.createElement('br'));
        form1.appendChild(document.createElement('br'));

        /* input submit */
        tmp = document.createElement('input');
        tmp.setAttribute('type', 'submit');
        tmp.setAttribute('class', 'submitbutton');
        tmp.setAttribute('value', 'Submit');
        form1.appendChild(tmp);
        
    /* Period question div */
    const pdQuestionDiv = document.createElement('div');
    pdQuestionDiv.setAttribute('id', 'pd-question');
    pdQuestionDiv.setAttribute('class', 'question');
    pdQuestionDiv.setAttribute('hidden', 'true');
    mainDiv.appendChild(pdQuestionDiv);
    
        /* Form tag */
        const form2 = document.createElement('form');
        form2.setAttribute('id', 'form2');
        pdQuestionDiv.appendChild(form2);

        /* b tag */
        tmp = document.createElement('b');
        tmp.innerText = 'Class Period';
        form2.appendChild(tmp);

        /* br */
        br(form2);

        /* i tag */
        tmp = createChild(form2, 'i');
        tmp.innerText = 'Please select the period this class takes place in.';

        /* br x2 */
        br(form2);
        br(form2);

        /* select label */
        createChild(form2, 'label', {
            for: 'pd-input'
        });

        /* select */
        let pdQuestionSelect = createChild(form2, 'select', {
            id: 'pd-input',
            name: 'pd-input'
        });

        /* select options */
        const PERIOD_OPTIONS = ['1', '2', '3', '4/5', '5/6', '6/7', '7/8', '8/9', '9/10', '11', '12'];
        for (const c of PERIOD_OPTIONS) {
            let opt = createChild(pdQuestionSelect, 'option', {
                value: c
            });
            opt.innerText = c;
        }

        /* input submit */
        createChild(form2, 'input', {
            type: 'submit',
            value: 'Submit',
            class: 'submitbutton'
        });

    /* mp question div */
    const mpQuestionDiv = createChild(mainDiv, 'div', {
        id: 'mp-question',
        class: 'question',
        hidden: 'true'
    });

        /* form tag */
        const form3 = createChild(mpQuestionDiv, 'form', {id: 'form3'});

        /* b tag */
        tmp = createChild(form3, 'b');
        tmp.innerText = 'Marking Period';

        /* br */
        br(form3);

        /* i tag */
        tmp = createChild(form3, 'i');
        tmp.innerText = "If this is a gym class, select full year, not your actual gym marking periods";

        /* br */
        br(form3);

        /* response options */
        const RESPONSES = [
            'Full Year',
            'MP 1',
            'MP 2',
            'MP 3',
            'MP 4',
            'Semester 1',
            'Semester 2'
        ];
        for (const c of RESPONSES) {
            createChild(form3, 'input', {
                type: 'radio',
                value: RESPONSES.indexOf(c).toString(),
                name: 'question1',
            });
            let label = createChild(form3, 'label', {
                for: 'question1-yes'
            });
            label.innerText = c;
            br(form3);
        }

        /* br */
        br(form3);

        /* input submit */
        createChild(form3, 'input', {
            type: 'submit',
            value: 'Submit',
            class: 'submitbutton'
        });

    /* hr question div */
    const hrQuestionDiv = createChild(mainDiv, 'div', {
        id: 'hr-question',
        class: 'question',
        hidden: 'true'
    });

        /* form tag */
        const form4 = createChild(hrQuestionDiv, 'form', {id: 'form4'});

        /* b tag */
        tmp = createChild(form4, 'b');
        tmp.innerText = 'Homeroom Number';

        /* br */
        br(form4);

        /* i tag */
        tmp = createChild(form4, 'i');
        tmp.innerText = "Do not include your grade number in your response (example: If your homeroom is 10-14, you should just enter 14).";

        /* br */
        br(form4);

        /* input label */
        tmp = createChild(form4, 'label', {
            for: 'question1-yes'
        });
        tmp.innerText = 'Enter hr:';

        /* hr input */
        createChild(form4, 'input', {
            type: 'text',
            class: 'fillerclass error',
            id: 'hrnum',
            name: 'question1'
        });

        /* br x2 */
        br(form4);
        br(form4);

        /* input submit */
        createChild(form4, 'input', {
            type: 'submit',
            value: 'Submit',
            class: 'submitbutton',
            id: 'hrsub'
        });
}

function br(elt) {
    elt.appendChild(document.createElement('br'));
}

function createChild(root, tag, options) {
    let elt = document.createElement(tag);
    if (!!options) {
        for (const k of Object.keys(options)) {
            if (k === 'class') {
                elt.className = options[k];
                continue;
            }
            elt[k] = options[k];
        }
    }
    root.appendChild(elt);
    return elt;
}