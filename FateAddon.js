class FateAddon extends Application {
    static style = `style="background: white; color: black; font-family:Arial;"`
    
    super(options){
    }

    static prepareButtons(hudButtons){   
        let hud = hudButtons.find(val => {return val.name == "token";})
            if (hud){
                hud.tools.push({
                    name:"ViewStress",//Completed
                    title:"View a summary of stress & consequences for all tokens",
                    icon:"fas fa-user-injured",
                    onClick: ()=> {viewStress();},
                    button:true
                });
            }
            if (hud){
                hud.tools.push({
                    name:"ViewAspects",
                    title:"View a summary of character aspects for all tokens",
                    icon:"fas fa-theater-masks",
                    onClick: ()=> {viewAspects();},
                    button:true
                });
            }

        }
    }
    
var fa = new FateAddon();

//This part of the code manages conditions that are created as an Extra with the word 'condition' or 'Condition' somewhere in the name
//and which terminate with _ and then a number (e.g. Condition: Physical Stress_4). It creates a formatted series of checkboxes on the 
//charactersheet and allows the data to be stored.

async function convertConditions (data){
    // Let's do some stuff if this extra is a Condition and we haven't already created the boxes for it.
    var extra = data.object; //We'll use the extra's ID as part of the key for its conditions' boxes and text area. Key will be condition name + extra ID.
    var actor = data.actor;

    //Split the condition name and number of boxes
    var split = extra.data.name.split("_");
    
    if (extra.data.name.toUpperCase().includes("CONDITION") && split.length >1){
        //This means we haven't initialised this field yet.
        var name = split[0];
        var boxes = split[1];
        var uni = name+extra._id;

        //Form the header row.
        var boxString=`<table title="condition"><tr><td style="background: black; color: white;">Boxes:</td></tr>`;
        boxString +="<tr><td>"
        for (let i = 0; i<boxes; i++){
            boxString += `<input type="checkbox" data-id="${uni}"/>`;
        }
        boxString +="</td></tr><tr>"
        boxString += `<td style="background: black; color: white;">Notes:<textarea id="${uni}notes" ${FateAddon.style}></textarea>`
        boxString +="</tr></table>"
        await actor.updateEmbeddedEntity("OwnedItem", {
            _id:extra._id,
            name:`${name}`,
            "data.description.value":`${boxString}`
        });
    }
}

Hooks.on ('renderExtraSheet', async (data) => {
    convertConditions(data);
})

// Now to save any changes made to the sheet to the underlying data when it's closed.
Hooks.on ('closeExtraSheet', async (data) => {
    var extra = data.object;
    var actor = data.actor;
    var uni = extra.data.name+extra._id;

    if (extra.data.name.toUpperCase().includes("CONDITION")){
        var cba = document.querySelectorAll(`input[data-id="${uni}"]:checked`); // Checked boxes
        var cbb = document.querySelectorAll(`input[data-id="${uni}"]`) // All boxes
        var na = document.querySelector(`textarea[id="${uni}notes"]`) 
        var boxString=`<table title="condition"><tr><td style="background: black; color: white;">Boxes:</td></tr>`;
        boxString +="<tr id='boxes'><td>"
        for (let i = 0; i < cba.length; i++){
            boxString+=`<input type="checkbox" data-id="${uni}" checked></input>`
        }
        for (let i = 0; i < (cbb.length - cba.length); i++){
            boxString+=`<input type="checkbox" data-id="${uni}"></input>`
        }
        boxString +="</td></tr><tr>"
        boxString += `<td style="background: black; color: white;" id="description">Notes:<textarea id="${uni}notes" ${FateAddon.style}>${na.value}</textarea>`
        boxString +="</tr></table>"
        await actor.updateEmbeddedEntity("OwnedItem", {
            _id:extra._id,
            "data.description.value":`${boxString}`
        });
    }
})

//This is the function that launches the StressViewer

function viewStress(){

    const delay = 200;

    Hooks.on('deleteToken', () => {
        setTimeout(function(){viewer.render(false);},delay);
    })

    Hooks.on('updateOwnedItem', () => {
        setTimeout(function(){viewer.render(false);},delay);
    })

    Hooks.on('updateActor', () => {
        setTimeout(function(){viewer.render(false);},delay);
    })

    Hooks.on('renderCoreCharacterSheet', () => {
        setTimeout(function(){viewer.render(false);},delay);
    })

    Hooks.on('updateToken', () => {
        setTimeout(function(){viewer.render(false);},delay);
    })

    Hooks.on('createToken', () => {
        setTimeout(function(){viewer.render(false);},delay);
    })

    //Hooks.on('controlToken',()=>{viewer.render(false);})

    class StressViewer extends Application {
        super(options){
        }

        activateListeners(html) {
                super.activateListeners(html);
                const myButton = html.find("button[name='clear']");
                const stressboxes = html.find("input[type='checkbox']")
                const consequences = html.find("textarea[name='consequence']")

                myButton.on("click", event => this._onClickButton(event, html));
                stressboxes.on("click", event => this._onCheckBoxClick(event, html));
                consequences.on("keyup", event => this._onEnterEvent(event, html));
              }   
              
        async _onCheckBoxClick(event, html){
            var actor=game.actors.find(actor => actor.id == event.target.dataset.actor);
            var itemId = event.target.dataset.item;
            var stype = event.target.dataset.type;
            var sindex = event.target.dataset.index;

             // Get the Items for each actor representing their stress boxes
            var stressCondition = actor.items.find(i=>i.type == "Extra" && i._id == itemId);   
            
             //Get the stress boxes for each actor
             if (stressCondition != undefined && stressCondition != null){
                var uni = stressCondition.data.name+stressCondition.data._id;
                var description = stressCondition.data.data.description.value;
                var doc = new DOMParser().parseFromString(description, "text/html");
                var boxes = doc.querySelectorAll(`input[data-id="${uni}"]`)
                //console.log(boxes);
            }

            //Get the textarea for each actor's stress tracks.
            try{
                    var d = doc.querySelector(`textarea[id="${uni}notes"]`);
                }   catch {
                    }
            
            if (boxes != undefined){
                    var boxString=`<table title="condition"><tr><td style="background: black; color: white;">Boxes:</td></tr>`;
                    boxString +="<tr id='boxes'><td>"
                    var isChecked = false;

                    for (let i = 0; i < (boxes.length); i++){                   
                    // This is the box that was changed on the stress viewer.
                    if (i==sindex){
                        isChecked = event.target.checked;
                        //console.log(isChecked);
                    } else {
                        isChecked = boxes[i].checked;
                        //console.log(isChecked)
                    }
                        if (isChecked){
                        boxString+=`<input type="checkbox" data-id="${uni}" checked></input>`
                    } else {
                        boxString+=`<input type="checkbox" data-id="${uni}"></input>`
                        }
                    }
                    boxString +="</td></tr><tr>"
                    boxString += `<td style="background: black; color: white;" id="description">Notes:<textarea id="${uni}notes" ${FateAddon.style}>${d.value}</textarea>`
                    boxString +="</tr></table>"
                    await actor.updateEmbeddedEntity("OwnedItem", {
                        _id:stressCondition.data._id,
                        "data.description.value":`${boxString}`
                        });
                
               }
            //console.log(actor); 
            //console.log(itemId);
            //console.log(stype);
            //console.log(sindex); 
        }

        async _onEnterEvent(event, data) {
                if(event.keyCode === 13){
                    var actorId = event.target.id.split("_")[1];
                    var consequence = event.target.id.split("_")[0];
                    //console.log(actorId+" "+consequence);
                    var actor=game.actors.find(actor=> actor.id == actorId);
                    var consequenceText = event.target.value.trim();
                    //console.log(consequenceText);
                    
                    // We now have everything we need to update the actor's consequences.
                    // They are all the way down in actor.data.data.health.cons
                    if (consequence == "mild1"){
                        //console.log("Should be updating mild");
                        await actor.update({"data.health.cons.mild.one":`${consequenceText}`});
                    }

                    if (consequence == "mild2"){
                        await actor.update({"data.health.cons.mild.two":`${consequenceText}`})
                    }
                    if (consequence == "moderate"){
                        await actor.update({"data.health.cons.moderate.value":`${consequenceText}`})
                    }
                    if (consequence == "severe"){
                        await actor.update({"data.health.cons.severe.value":`${consequenceText}`})
                    }
                }
            }

        async _onClickButton(event, html) {
                //console.log("Event target id "+event.target.id);
                
                //This is the functionality to clear the stress of all tokens.

                let tokens = canvas.tokens.placeables;

                tokens.forEach(token => {
                    // Get the Items for each actor representing their stress boxes
                    var pStressCondition = token.actor.items.find(i=>i.type == "Extra" && i.name.toUpperCase().includes("CONDITION") && i.name.toUpperCase().includes ("PHYSICAL") && i.name.toUpperCase().includes("STRESS"));
                    var mStressCondition = token.actor.items.find(i=>i.type == "Extra" && i.name.toUpperCase().includes("CONDITION") && i.name.toUpperCase().includes ("MENTAL") && i.name.toUpperCase().includes("STRESS"));

                    //Get the stress boxes for each actor
                    if (pStressCondition != undefined && pStressCondition != null && mStressCondition != undefined && mStressCondition != null){
                        var pUni = pStressCondition.data.name+pStressCondition.data._id;
                        var pDescription = pStressCondition.data.data.description.value;
                        var pdoc = new DOMParser().parseFromString(pDescription, "text/html");
                        var pboxes = pdoc.querySelectorAll(`input[data-id="${pUni}"]`)
                    }
                    
                    //console.log(mStressCondition);
                    if (mStressCondition != undefined && mStressCondition != null && mStressCondition != undefined && mStressCondition != null){
                        var mDescription = mStressCondition.data.data.description.value;
                        var mUni = mStressCondition.data.name+mStressCondition.data._id;
                        var mdoc = new DOMParser().parseFromString(mDescription, "text/html");
                        var mboxes = mdoc.querySelectorAll(`input[data-id="${mUni}"]`)
                    }

                    //Get the textarea for each actor's stress tracks.
                    try{
                        var pd = pdoc.querySelector(`textarea[id="${pUni}notes"]`);
                        var md = mdoc.querySelector(`textarea[id="${mUni}notes"]`);
                    } catch {

                    }
                    //Output the same number of text boxes with the same ID, only this time they need to be blank. We know the unique ID to use in the data.

                    if (pboxes != undefined){(async ()=>{
                            var boxString=`<table title="condition"><tr><td style="background: black; color: white;">Boxes:</td></tr>`;
                            boxString +="<tr id='boxes'><td>"
                            for (let i = 0; i < (pboxes.length); i++){
                                boxString+=`<input type="checkbox" data-id="${pUni}"></input>`
                            }
                                boxString +="</td></tr><tr>"
                                boxString += `<td style="background: black; color: white;" id="description">Notes:<textarea id="${pUni}notes" ${FateAddon.style}>${pd.value}</textarea>`
                                boxString +="</tr></table>"
                                await token.actor.updateEmbeddedEntity("OwnedItem", {
                                    _id:pStressCondition.data._id,
                                    "data.description.value":`${boxString}`
                                });
                    })()}

                    if (mboxes != undefined){(async ()=>{
                            var boxString=`<table title="condition"><tr><td style="background: black; color: white;">Boxes:</td></tr>`;
                            boxString +="<tr id='boxes'><td>"
                            for (let i = 0; i < mboxes.length; i++){
                                boxString+=`<input type="checkbox" data-id="${mUni}"></input>`
                            }
                            boxString +="</td></tr><tr>"
                            boxString += `<td style="background: black; color: white;" id="description">Notes:<textarea id="${mUni}notes" ${FateAddon.style}>${md.value}</textarea>`
                            boxString +="</tr></table>"
                            await token.actor.updateEmbeddedEntity("OwnedItem", {
                                _id:mStressCondition.data._id,
                                "data.description.value":`${boxString}`
                            });
                    })()}
                })
            }

        // This method reads the stress from the tokens in the scene and outputs it to the StressViewer window.
        prepareStress(){
            let tokens = canvas.tokens.placeables;
            let buttons= {}
            let actor;            
            // Set up the table parameters
            let table=`<table id="sview" border="1" cellspacing="0" cellpadding="4" style="width: auto;">`;

            // Set up the appearance of the table header
            let rows=[`<tr><td style="background: black; color: white;" width="150">Character</td><td style="background: black; color: white;" width="80">Physical Stress</td><td style="background: black; color: white;" width="80">Mental Stress</td><td style="background: black; color: white;" width="150">Mild</td><td style="background: black; color: white;" width="150">Mild</td><td style="background: black; color: white;" width="150">Moderate</td><td style="background: black; color: white;" width="150">Severe</td>`];
            
            //This is where we get the stress information for each actor.
            
            for (let i=0;i<tokens.length;i++){
                
                // Get the actor
                let actor = tokens[i].actor;
                let consequences = actor.data.data.health.cons;

                // Get the items representing physical stress and mental stress
                var pStressCondition = actor.items.find(i=>i.type == "Extra" && i.name.toUpperCase().includes("CONDITION") && i.name.toUpperCase().includes ("PHYSICAL") && i.name.toUpperCase().includes("STRESS"));
                var mStressCondition = actor.items.find(i=>i.type == "Extra" && i.name.toUpperCase().includes("CONDITION") && i.name.toUpperCase().includes ("MENTAL") && i.name.toUpperCase().includes("STRESS"));

                if (pStressCondition != undefined && pStressCondition != null && mStressCondition != undefined && mStressCondition != null){
                    var pDescription = pStressCondition.data.data.description.value;
                    var pdoc = new DOMParser().parseFromString(pDescription, "text/html");
                    var pboxes = pdoc.querySelectorAll(`input[type="checkbox"]`)
                }

                if (mStressCondition != undefined && mStressCondition != null && mStressCondition != undefined && mStressCondition != null){
                    var mDescription = mStressCondition.data.data.description.value;
                    //console.log(pDescription);
                    var mdoc = new DOMParser().parseFromString(mDescription, "text/html");
                    var mboxes = mdoc.querySelectorAll(`input[type="checkbox"]`)
                }

                var disabled="";
                if (!game.user.isGM){
                    disabled="disabled";
                }

                var pboxString="<td>"
                if (pboxes != undefined){
                        try {
                            for (let bi=0; bi<pboxes.length;bi++){
                                //console.log(actor);
                                if (pboxes[bi].checked){
                                    pboxString+=`<input type="checkbox" data-actor="${actor.id}" data-item="${pStressCondition.data._id}" data-index="${bi}" data-type="physical" checked ${disabled}></input>`
                                }
                                else {
                                    pboxString+=`<input type="checkbox" data-actor="${actor.id}" data-item="${pStressCondition.data._id}" data-index="${bi}" data-type="physical" ${disabled}></input>`
                                }
                        }
                    } catch {

                    }
                }
                pboxString+="</td>"

                var mboxString="<td>"
                if (mboxes != undefined){
                    try {
                        for (let bi=0; bi<mboxes.length;bi++){
                            //console.log(box);
                            if (mboxes[bi].checked){
                                mboxString+=`<input type="checkbox" data-actor="${actor.id}" data-item="${mStressCondition.data._id}" data-index="${bi}" data-type="mental" checked ${disabled}></input>`
                            }
                            else {
                                mboxString+=`<input type="checkbox" data-actor="${actor.id}" data-item="${mStressCondition.data._id}" data-index="${bi}" data-type="mental" ${disabled}></input>`
                            }
                        }
                    }catch {
                            
                    }
                }
                mboxString+="</td>"

                //We need to not display a second Mild consequence if the actor isn't entitled to one. 

                var mild2 = "";
                var items = actor.data.items;
                items.forEach(item =>{
                    try {
                        if ((item.data.health.physical || item.data.health.mental) && item.data.level > 4){
                            //console.log("Should be creating second mild consequence");
                            mild2 = `<textarea name="consequence" ${FateAddon.style} id="mild2_${actor.id}" ${disabled}>${consequences.mild.two}</textarea>`
                        }
                    } catch {

                    }
                })

                let row = `<tr>
                            <td>${actor.name}</td>
                            ${pboxString}
                            ${mboxString}
                            <td><textarea name="consequence" ${FateAddon.style} id="mild1_${actor.id}" ${disabled}>${consequences.mild.one}</textarea></td>
                            <td>${mild2}</td>
                            <td><textarea name="consequence" ${FateAddon.style}id="moderate_${actor.id}" ${disabled}>${consequences.moderate.value}</textarea></td>
                            <td><textarea name="consequence" ${FateAddon.style} id="severe_${actor.id}" ${disabled}>${consequences.severe.value}</textarea></td>
                        </tr>`
                rows.push(row);
                }
            let myContents=`${table}`;
            rows.forEach(element => myContents+=element)
            if(game.user.isGM){
                myContents+=`<tr><td colspan="7" align="center"><button style="height:30px; width:200px" name="clear">Clear All Stress</button></td></tr>`;
            }
            myContents+="</table>"
            
            return myContents;    
        }

        getData (){
            let content={content:`${this.prepareStress()}`}
            return content;
        }
    }

    let opt=Dialog.defaultOptions;
    opt.resizable=true;
    opt.title="View Stress and Consequences";
    opt.width=1190;
    opt.height=500;
    opt.minimizable=true;

    var viewer;
    viewer = new StressViewer(opt);
    viewer.render(true);
}

function viewAspects(){

    const delay = 200;

    Hooks.on('deleteToken', () => {
        setTimeout(function(){viewer.render(false);},delay);
    })

    Hooks.on('updateActor', () => {
        setTimeout(function(){viewer.render(false);},delay);
    })

    Hooks.on('renderCoreCharacterSheet', () => {
        setTimeout(function(){viewer.render(false);},delay);
    })

    Hooks.on('updateToken', () => {
        setTimeout(function(){viewer.render(false);},delay);
    })

    Hooks.on('createToken', () => {
        setTimeout(function(){viewer.render(false);},delay);
    })

    class AspectViewer extends Application {
        super(options){
        }

        getData (){
            let content={content:`${this.prepareAspects()}`}
            return content;
        }

        // This method reads the stress from the tokens in the scene and outputs it to the StressViewer window.
        prepareAspects(){
            let tokens = canvas.tokens.placeables;
            let buttons= {}
            let actor;            
            // Set up the table parameters
            var table=`<table border="1" cellspacing="0" cellpadding="4" style="width: auto;">`;

            // Set up the appearance of the table header
            let rows=[`<tr><td style="background: black; color: white;">Portrait</td><td style="background: black; color: white;">Character</td><td style="background: black; color: white;">High Concept</td><td style="background: black; color: white;">Trouble</td><td style="background: black; color: white;">Other 1</td><td style="background: black; color: white;">Other 2</td><td style="background: black; color: white;">Other 3</td>`];
            
            //This is where we get the stress information for each actor.
            
            for (let i=0;i<tokens.length;i++){
                
                // Get the actor
                let actor = tokens[i].actor;

                // get name
                var charName=actor.name;
                console.log(name);

                // get High Concept
                var hc=actor.data.data.aspects.hc.value;

                // get Trouble
                var trouble=actor.data.data.aspects.trouble.value;
                console.log(trouble);

                // Get Other 1
                var other1=actor.data.data.aspects.other.value[0];
                console.log(other1);

                // Get Other 2
                var other2=actor.data.data.aspects.other.value[1];

                // Get Other 3
                var other3=actor.data.data.aspects.other.value[2];
                
                rows.push(`<tr><td><img src="${actor.img}" width="50" height="50"></td><td>${charName}</td><td>${hc}</td><td>${trouble}</td><td>${other1}</td><td>${other2}</td><td>${other3}</td></tr>`);
            }
            var myContents= table;
            rows.forEach(row=> {
                myContents+=row;
            })
            myContents += `</table>`;

            return myContents;    
        }
    }
    let opt=Dialog.defaultOptions;
    opt.resizable=true;
    opt.title="View Aspects";
    opt.width=1000;
    opt.height=400;
    opt.minimizable=true;

    var viewer;
    viewer = new AspectViewer(opt);
    viewer.render(true);
}

Hooks.on('getSceneControlButtons', function(hudButtons)
{
    FateAddon.prepareButtons(hudButtons);
})

