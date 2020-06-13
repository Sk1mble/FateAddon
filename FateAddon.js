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
            if (hud){
                hud.tools.push({
                    name:"ViewFatePoints",
                    title:"View a summary of Fate Points for all players (and the GM)",
                    icon:"fas fa-coins",
                    onClick: ()=> {viewFatePoints();},
                    button:true
                });
            }
        }
    }
    
var fa = new FateAddon();

//Step one: Create an archtitecture for managing stress and conditions at the token level.
//Step two: Create a right-click menu on tokens for managing their stress and conditions.
//Step three: Update the Stressviewer to suck data from the flags used in the previous steps
//instead of from checkboxes on the character sheet.

//This is the function that launches the StressViewer

function viewStress(){

    const delay = 200;

    Hooks.on('deleteToken', () => {
        setTimeout(function(){viewer.render(false);},delay);
    })

    Hooks.on('closeConditionDialog', () => {
        setTimeout(function(){viewer.render(false);},delay);
    })

    Hooks.on('closeConditionEditor', () => {
        setTimeout(function(){viewer.render(false);},delay);
    })
    Hooks.on('renderConditionViewer', () => {
        setTimeout(function(){viewer.render(false);},delay);
    })

    Hooks.on('closeConditionViewer', () => {
        setTimeout(function(){viewer.render(false);},delay);
    })

    Hooks.on('renderActorSheet', () => {
        setTimeout(function(){viewer.render(false);},delay);
    })

    Hooks.on('createToken', () => {
        setTimeout(function(){viewer.render(false);},delay);
    })

    Hooks.on('updateToken', (scene, token, data) => {
        if (data.hidden!=undefined){
          setTimeout(function(){viewer.render(false);},delay);
        }
    });

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
                consequences.on("change", event => this._onChangeEvent(event, html));
              }   
        
            //Implement the code to store changes to the stress checkboxes.
            async _onCheckBoxClick(event, html){
            //This is the function that reads changes to the stress boxes and outputs them to the Conditions flag as is proper.
            
            //Get the stress boxes for each actor
            //First, get the actor.
            //console.log(event.target.id)
            var tokenId=event.target.id.split("_")[0];
            var con=event.target.id.split("_")[1];
            var boxId = event.target.id.split("_")[2];
            var token = canvas.tokens.placeables.find(t => t.id == tokenId);
            var actor = token.actor;

            if (game.settings.get("FateAddon", "usesheetstress")){
                //Do this if they want to use sheet stress
                if (con="Accelerated Stress"){
                    if (event.target.checked){
                        if (boxId==1){
                            await actor.update({"data.health.stress.1":true})
                        }
                        if (boxId==2){
                            await actor.update({"data.health.stress.2":true})
                        }
                        if (boxId==3){
                            await actor.update({"data.health.stress.3":true})
                        }
                    } else {
                        if (boxId==1){
                            await actor.update({"data.health.stress.1":false})
                        }
                        if (boxId==2){
                            await actor.update({"data.health.stress.2":false})
                        }
                        if (boxId==3){
                            await actor.update({"data.health.stress.3":false})
                        }
                    }

                }
                if (con=="Physical Stress"){
                    if (event.target.checked){
                        if (boxId==1){
                            await actor.update({"data.health.stress.physical.1":true})
                        }
                        if (boxId==2){
                            await actor.update({"data.health.stress.physical.2":true})
                        }
                        if (boxId==3){
                            await actor.update({"data.health.stress.physical.3":true})
                        }
                        if (boxId==4){
                            await actor.update({"data.health.stress.physical.4":true})
                        }
                    } else {
                        if (boxId==1){
                            await actor.update({"data.health.stress.physical.1":false})
                        }
                        if (boxId==2){
                            await actor.update({"data.health.stress.physical.2":false})
                        }
                        if (boxId==3){
                            await actor.update({"data.health.stress.physical.3":false})
                        }
                        if (boxId==4){
                            await actor.update({"data.health.stress.physical.4":false})
                        }
                    }
                }
                if (con=="Mental Stress"){
                    if (event.target.checked){
                        if (boxId==1){
                            await actor.update({"data.health.stress.mental.1":true})
                        }
                        if (boxId==2){
                            await actor.update({"data.health.stress.mental.2":true})
                        }
                        if (boxId==3){
                            await actor.update({"data.health.stress.mental.3":true})
                        }
                        if (boxId==4){
                            await actor.update({"data.health.stress.mental.4":true})
                        }
                    } else {
                        if (boxId==1){
                            await actor.update({"data.health.stress.mental.1":false})
                        }
                        if (boxId==2){
                            await actor.update({"data.health.stress.mental.2":false})
                        }
                        if (boxId==3){
                            await actor.update({"data.health.stress.mental.3":false})
                        }
                        if (boxId==4){
                            await actor.update({"data.health.stress.mental.4":false})
                        }
                    }
                }
            }

            if (!game.settings.get("FateAddon", "usesheetstress")){
                //Otherwise use condition stress
                var conditions=actor.getFlag("FateAddon","conditions");
                var condition=conditions.find(c => c.name==con);
                if (event.target.checked){
                    condition.boxes[boxId]=true;
                } else {
                    condition.boxes[boxId]=false;
                }
                //console.log(condition);
                await actor.unsetFlag("FateAddon","conditions");
                await actor.setFlag("FateAddon","conditions",conditions);
                await game.socket.emit("module.FateAddon",{"Updated":true});
                this.render(false);
            }
        }

        async _onChangeEvent(event, data) {
            // This function outputs changes to consequences made from the StressViewer window.
                //console.log(event.target);
                var tokenId = event.target.id.split("_")[1];
                var consequence = event.target.id.split("_")[0];
                //console.log(actorId+" "+consequence);

                var tokens = canvas.tokens.placeables;
                //console.log(tokens[0].id)

                //Find the token that has the matching ID, then get its actor, for those are the consequences we seek.
                //Except this is finding the wrong actor.
                var actor = tokens.find(token=> token.id == tokenId).actor;

                //var actor=game.actors.find(actor=> actor.id == actorId);
                var consequenceText = event.target.value.trim();
                //console.log(consequenceText);
                
                // We now have everything we need to update the actor's consequences.
                // They are all the way down in actor.data.data.health.cons
                if (consequence == "accmild"){
                    await actor.update({"data.health.cons.mild.value":`${consequenceText}`});
                }

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
                await game.socket.emit("module.FateAddon",{"Updated":true});
        }

        async _onClickButton(event, html) {
                //This is the functionality to clear the stress of all tokens.
                let tokens = canvas.tokens.placeables;

                //If we're using core sheet stress:
                if (game.settings.get("FateAddon", "usesheetstress")){
                        tokens.forEach(async token=>{
                        let actor = token.actor;
                        if (actor.data.type!="Accelerated"){
                            await actor.update({"data.health.stress.physical":{1:false, 2:false,3:false,4:false}})
                            await actor.update({"data.health.stress.mental":{1:false, 2:false,3:false,4:false}})
                        }
                        else {
                            await actor.update({"data.health.stress":{1:false, 2:false,3:false}})
                        }
                   })
                }
                //If we're using condition stress:
                if (!game.settings.get("FateAddon", "usesheetstress")){
                    tokens.forEach(async token=>{
                        var conds = token.actor.getFlag("FateAddon","conditions");
                        //console.log(conds);
                        var pStress = conds.find(condition=>condition.name=="Physical Stress");
                        var pboxes = pStress.boxes;
                        for (let i=0;i<pboxes.length;i++){
                            pboxes[i]=false;
                        }
                        var mStress = conds.find(condition=>condition.name=="Mental Stress");
                        var mboxes = mStress.boxes;
                        for (let i=0;i<mboxes.length;i++){
                            mboxes[i]=false;
                        }
                        //console.log(mStress);
    
                        await token.actor.unsetFlag("FateAddon","conditions");
                        await token.actor.setFlag("FateAddon","conditions",conds);
                        //console.log(conds);
                        await game.socket.emit("module.FateAddon",{"Updated":true});
                        this.render(false);
                    })
                }
            }

        //This method reads the stress from the tokens in the scene and outputs it to the StressViewer window.
        prepareStress(){
            let tokens = canvas.tokens.placeables;
            let buttons= {}
            let actor;            
            // Set up the table parameters
            let table=`<table id="sview" border="1" cellspacing="0" cellpadding="4" style="width: auto;">`;

            // Set up the appearance of the table header
            let rows=[`<tr><td style="background: black; color: white;" width="150">Character</td><td style="background: black; color: white;" width="100">Physical Stress</td><td style="background: black; color: white;" width="100">Mental Stress</td><td style="background: black; color: white;" width="150">Mild</td><td style="background: black; color: white;" width="150">Mild</td><td style="background: black; color: white;" width="150">Moderate</td><td style="background: black; color: white;" width="150">Severe</td></tr>`];
            
            //This is where we get the stress information for each actor.

            var disabled="";
            if (!game.user.isGM){
                disabled="disabled";
            }

            for (let i=0;i<tokens.length;i++){
            // Don't display if this token is hidden
            if (tokens[i].data.hidden && !game.user.isGM){
                continue;
                                }
                // Get the token
                let token = tokens[i];
                let actor = token.actor;
                let consequences = actor.data.data.health.cons;

                if (game.settings.get("FateAddon", "usesheetstress")){
                    var pboxes = 2;
                    var mboxes = 2;
                    var aboxes = 0;
                    
                    if (actor.data.type=="Accelerated"){
                        pboxes=0;
                        mboxes=0;
                        aboxes=3;
                    }

                    var items = token.actor.data.items;

                    if (actor.data.type!="Accelerated"){
                        items.forEach(item =>{
                            try {
                                if (item.data.health.physical && item.data.level >0 && item.data.level <3){
                                    //Character has three physical stress boxes.
                                    pboxes = 3;
                                }
                                if (item.data.health.physical && item.data.level >=3){
                                    //Character has four physical stress boxes.
                                    pboxes = 4;
                                }
                                if (item.data.health.mental && item.data.level >0 && item.data.level <3){
                                    //Character has three mental stress boxes.
                                    mboxes = 3;
                                }
                                if (item.data.health.mental && item.data.level >=3){
                                    //Character has four mental stress boxes.
                                    mboxes = 4;
                                }
                            } catch {
                            }
                        })
                    }
                    var mboxString =""
                    var pboxString="";
                    //Using core sheet stress

                    if (mboxes !=0 && pboxes !=0 && aboxes == 0){
                        pboxString="<td>"

                        for (let i=1; i<=pboxes;i++){
                            if (actor.data.data.health.stress.physical[i]){
                                pboxString+=`<input type ="checkbox" id="${token.id}_Physical Stress_${i}" ${disabled} checked></input>`
                            }
                            if (!actor.data.data.health.stress.physical[i]){
                                pboxString+=`<input type ="checkbox" id="${token.id}_Physical Stress_${i}" ${disabled}></input>`
                            }
                        }
                        pboxString+="</td>"

                        // Here is where we add the mental stress boxes.
                        mboxString="<td>"
                        //Need to add the mental stress boxes to mboxString here.
                        for (let i=1; i<=mboxes;i++){
                            if (actor.data.data.health.stress.mental[i]){
                                mboxString+=`<input type ="checkbox" id="${token.id}_Mental Stress_${i}" ${disabled} checked></input>`
                            }
                            if (!actor.data.data.health.stress.mental[i]){
                                mboxString+=`<input type ="checkbox" id="${token.id}_Mental Stress_${i}" ${disabled}></input>`
                            }
                        }
                        mboxString+="</td>"
                    }
                }

                if (aboxes !=0 && aboxes != undefined){
                    var aboxString='<td colspan="2" align="center">'
                    for (let i=1; i<=aboxes;i++){
                        if (actor.data.data.health.stress[i]){
                            aboxString+=`<input type ="checkbox" id="${token.id}_Accelerated Stress_${i}" ${disabled} checked></input>`
                        }
                        if (!actor.data.data.health.stress[i]){
                            aboxString+=`<input type ="checkbox" id="${token.id}_Accelerated Stress_${i}" ${disabled}></input>`
                        }
                    }
                    aboxString+="</td>"
                } else {aboxString=""};
    
                if (!game.settings.get("FateAddon", "usesheetstress")){
                    //Using conditions stress
                        // Get this actor's physical stress and mental stress and number of boxes already marked.
                        try {
                                var pStress=token.actor.getFlag("FateAddon","conditions").find(cond=>cond.name=="Physical Stress");
                                var mStress=token.actor.getFlag("FateAddon","conditions").find(cond=>cond.name=="Mental Stress");
                                
                                if ((pStress==undefined || pStress==null) && (mStress == undefined || mStress==null)){
                                    continue;
                                }

                                if (pStress==undefined){
                                    pStress = {name:"Physical Stress", "boxes":[], "description":"Not Used", "notes":"Not Used"}
                                }
                                if (mStress == undefined){
                                    mStress = {name:"Mental Stress", "boxes":[], "description":"Not Used", "notes":"Not Used"}
                                }
                    } catch {
                            continue;
                    }

                    var pboxString="<td>"
                    //Need to add the physical stress boxes to pboxString here.
            
                    for (let i = 0; i<pStress.boxes.length; i++){
                        if (pStress.boxes[i]==true){
                            pboxString+=`<input type ="checkbox" id="${token.id}_${pStress.name}_${i}" ${disabled} checked></input>`
                        }
                        if (pStress.boxes[i]==false){
                            pboxString+=`<input type ="checkbox" id="${token.id}_${pStress.name}_${i}" ${disabled}></input>`
                        }
                    }
                    pboxString+="</td>"

                    var mboxString="<td>"
                    // Here is where we add the mental stress boxes.
                    var mboxString="<td>"
                    //Need to add the mental stress boxes to mboxString here.
                    for (let i = 0; i<mStress.boxes.length; i++){
                        if (mStress.boxes[i]==true){
                            mboxString+=`<input type ="checkbox" id="${token.id}_${mStress.name}_${i}" ${disabled} checked></input>`
                        }
                        if (mStress.boxes[i]==false){
                            mboxString+=`<input type ="checkbox" id="${token.id}_${mStress.name}_${i}" ${disabled}></input>`
                        }
                    }
                    mboxString+="</td>"
                }

                //We need to not display a second Mild consequence if the actor isn't entitled to one. 
                var mild2 = "";
                var items = token.actor.data.items;
                items.forEach(item =>{
                    try {
                        if ((item.data.health.physical || item.data.health.mental) && item.data.level > 4){
                            //console.log("Should be creating second mild consequence");
                            mild2 = `<textarea name="consequence" ${FateAddon.style} id="mild2_${token.id}" ${disabled}>${consequences.mild.two}</textarea>`
                        }
                    } catch {
                    }
                })
                var mildOne=``;
                if (actor.data.type=="Accelerated"){
                    mildOne=`<td><textarea name="consequence" ${FateAddon.style} id="accmild_${token.id}" ${disabled}>${consequences.mild.value}</textarea></td>`
                } else {
                    mildOne = `<td><textarea name="consequence" ${FateAddon.style} id="mild1_${token.id}" ${disabled}>${consequences.mild.one}</textarea></td>`
                }

                let row = `<tr>
                            <td>${token.name}</td>
                            ${pboxString}
                            ${mboxString}
                            ${aboxString}
                            ${mildOne}
                            <td>${mild2}</td>
                            <td><textarea name="consequence" ${FateAddon.style}id="moderate_${token.id}" ${disabled}>${consequences.moderate.value}</textarea></td>
                            <td><textarea name="consequence" ${FateAddon.style} id="severe_${token.id}" ${disabled}>${consequences.severe.value}</textarea></td>
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
    game.socket.on("module.FateAddon", data => {
        viewer.render(false);
        //console.log("Socket received");
    })
}

function viewAspects(){

    const delay = 200;

    Hooks.on('deleteToken', () => {
        setTimeout(function(){viewer.render(false);},delay);
    })

    Hooks.on('updateActor', () => {
        setTimeout(function(){viewer.render(false);},delay);
    })

    Hooks.on('renderActorSheet', () => {
        setTimeout(function(){viewer.render(false);},delay);
    })

    Hooks.on('createToken', () => {
        setTimeout(function(){viewer.render(false);},delay);
    })

    Hooks.on('updateToken', (scene, token, data) => {
        if (data.hidden!=undefined){
          setTimeout(function(){viewer.render(false);},delay);
        }
    })

    class AspectViewer extends Application {
        super(options){
        }

        getData (){
            let content={content:`${this.prepareAspects()}`}
            return content;
        }

        // This method reads the aspects from the tokens in the scene and outputs them to the AspectViewer window.
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
                
                // Don't display if this token is hidden
                if (tokens[i].data.hidden && !game.user.isGM){
                    continue;
                }

                // Get the actor
                let actor = tokens[i].actor;

                // get name
                var charName=tokens[i].name;
                //console.log(name);

                // get High Concept
                var hc=actor.data.data.aspects.hc.value;

                // get Trouble
                var trouble=actor.data.data.aspects.trouble.value;
                //console.log(trouble);

                // Get Other 1
                var other1=actor.data.data.aspects.other.value[0];
                //console.log(other1);

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

function viewFatePoints(){

    const delay = 200;

    Hooks.on('updateUser', () => {
        setTimeout(function(){viewer.render(false);},delay);
    })

    Hooks.on('updateActor', () => {
        setTimeout(function(){viewer.render(false);},delay);
    })

    Hooks.on('renderCoreCharacterSheet', () => {
        setTimeout(function(){viewer.render(false);},delay);
    })

    class FatePointViewer extends Application {
        super(options){
        }

        activateListeners(html) {
            super.activateListeners(html);
            const fpInput = html.find("input[type='number']")

            fpInput.on("change", event => this._onfpupdate(event, html));
          }   
          
    async _onfpupdate(event, html){
        let userId = event.target.id;
        let user = game.users.find(u => u.id==userId);
        var fp = event.target.value;
        
        if (user.isGM){
            (async ()=>{await user.setFlag("FateAddon","gmfatepoints",`${fp}`)})();
        } else {
            let actor = user.character;
            (async ()=> {await actor.update({"data.details.points.current":`${fp}`});})();
        }

    }

        getData (){
            let content={content:`${this.prepareFatePoints()}`}
            return content;
        }

        // This method gets the fate points for each player and the GM and outputs it to the window in a way that the GM can edit.
        prepareFatePoints(){
            let users = game.users.entries;
            let buttons= {}
            let actor;            
            // Set up the table parameters
            var table=`<table border="1" cellspacing="0" cellpadding="4" style="width: auto;">`;

            // Set up the appearance of the table header
            let rows=[`<tr><td style="background: black; color: white;">Portrait</td><td style="background: black; color: white;">Character</td><td style="background: black; color: white;">Fate Points</td>`];
            
            //This is where we get the FP information for each actor.
            //The GM's fate points will be stored on the GM user.

            //Now we just need to set up the action listener, which will fire on onchange

            //if (user.isgm) - then get fate points from the user.getFlag("FateAddon","gmfatepoints"). If that's undefined, set to 0 and write back out to the GM's flag.
            //Otherwise, get the user's character's fate points.
            
            for (let i=0;i<users.length;i++){
                let user = users[i];
                let actor;
                let image = "Tokens/icons/hand-of-god.png";
                let name = user.name;
                let fp = 0;
                let disabled = "";

                //We only want to display fate points for logged in users.
                if (!game.user.isGM){
                    disabled = "disabled";
                }
                
                if (user.active){
                        if (!user.isGM){
                            actor = users[i].character;
                            image = actor.data.img;
                            name=actor.name;
                            fp = actor.data.data.details.points.current;
                        } else {
                            fp = user.getFlag("FateAddon","gmfatepoints");
                            if (fp == undefined || fp == null){
                                fp = 0;
                                user.setFlag("FateAddon","gmfatepoints",0);
                            }
                        }                   
                        rows.push(`<tr><td><img src="${image}" width="50" height="50"></td><td>${name}</td><td><input type="number" id="${user.id}" value="${fp}" ${disabled}></input></td></tr>`);
                }
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
    opt.title="View Fate Points";
    opt.width=400;
    opt.height=300;
    opt.minimizable=true;

    var viewer;
    viewer = new FatePointViewer(opt);
    viewer.render(true);
}

Hooks.on('getSceneControlButtons', function(hudButtons)
{
    FateAddon.prepareButtons(hudButtons);
})

async function manageConditions(a){
    var actor = a;
    var conditions = actor.getFlag("FateAddon","conditions");
    //console.log(conditions);
    
    //Initialise physical stress and mental stress for this actor, as no conditions have been set up yet.
    //                if (!game.settings.get("FateAddon", "usesheetstress")){
    if (conditions == undefined && !game.settings.get("FateAddon", "usesheetstress")){
        conditions = [
            {
                "name":"Physical Stress",
                "boxes":[false,false,false],
                "description":"Physical Stress (used by StressViewer)",
                "notes":""
            },{
                "name":"Mental Stress",
                "boxes":[false,false,false],
                "description":"Mental Stress (used by StressViewer)",
                "notes":""
            }
        ]
        await actor.unsetFlag("FateAddon","conditions");
        await actor.setFlag("FateAddon", "conditions",conditions);
    }

    class ConditionViewer extends Application {
        super(options){
        }

        activateListeners(html) {
            super.activateListeners(html);
            const myButton = html.find("button[id='editConditions']");
            const stressboxes = html.find("input[type='checkbox']")
            const description = html.find("textarea")

            myButton.on("click", event => this._onClickButton(event, html));
            stressboxes.on("click", event => this._onCheckBoxClick(event, html));
            description.on("change", event => this._onChangeEvent(event, html));
        }

        async _onClickButton(event, html){
            let opt=Dialog.defaultOptions;
            opt.resizable=true;
            opt.title=`Edit Stress and Conditions for ${actor.name}`;
            opt.width=825;
            opt.height=600;
            opt.minimizable=true;

            var viewer;
            viewer = new ConditionEditor(opt);
            viewer.render(true);
            game.socket.on("module.FateAddon", data => {
                viewer.render(false);
            })
            const delay = 200;
        }

        async _onChangeEvent(event, html){
            var n = event.target.id;
            //console.log(n);
            conditions.find(condition => condition.name==n).notes=event.target.value;
            await actor.unsetFlag("FateAddon","conditions");
            await actor.setFlag("FateAddon","conditions",conditions);
            await game.socket.emit("module.FateAddon",{"Updated":true});
            this.render(false);
        }

        async _onCheckBoxClick(event, html){
            //console.log("Checkbox Clicked");
            var c = event.target.checked;
            //console.log(event.target.name);
            if (c){
                conditions.find(condition => condition.name==event.target.name).boxes[event.target.id]=true;
            }
            if (!c){
                conditions.find(condition => condition.name==event.target.name).boxes[event.target.id]=false;
                //console.log(event.target.id);
            }
            await actor.unsetFlag("FateAddon","conditions");
            await actor.setFlag("FateAddon","conditions",conditions);
            await game.socket.emit("module.FateAddon",{"Updated":true});
            this.render(false);
        }

        getData(){
            var pcondmanage = game.settings.get("FateAddon", "pcondmanage");
            var pcondedit = game.settings.get("FateAddon", "pcondedit");
            var disabled="";

            if (!game.user.isGM && pcondmanage==false){
                disabled="disabled";
            }
            super.getData();
            conditions = actor.getFlag("FateAddon","conditions");
            if (conditions==undefined){
                conditions=[];
            }
            var myContent ="";
            let table=`<table id="cview" border="1" cellspacing="0" cellpadding="4" style="width: 800px; height: auto">`;
            myContent+=`${table}<tr><td style="background: black; color: white;">Name</td><td style="background: black; color: white; width">Boxes</td><td style="background: black; color: white;">Notes</td></tr>`
            conditions.forEach(condition=>{
                myContent+="<tr>";
                myContent+=`<td>${condition.name}</td>`;
                myContent+=`<td>`;
                for (let i = 0; i<condition.boxes.length;i++){
                    if (condition.boxes[i]==false){
                        myContent+=`<input type ="checkbox" name="${condition.name}" id="${i}" ${disabled}></input>`
                    }
                    if (condition.boxes[i]==true){
                        myContent+=`<input type ="checkbox" name="${condition.name}" id="${i}" checked ${disabled}></input>`
                    }
                }
                myContent+=`</td>`;
                myContent+=`<td><textarea id="${condition.name}" ${FateAddon.style} ${disabled}>${condition.notes}</textarea></td>`
                myContent+="</tr>";
            })
            if (game.user.isGM || pcondedit==true){
                myContent+=`<tr><td colspan="3" align="center"><button type="button" id="editConditions" style="height:30px; width:200px">Edit or Add Conditions</button></td></tr>`
            }
            myContent+="</table>";
            let content={content:`${myContent}`}
            return content;
        }
    }

    class ConditionEditor extends Application {
        super(options){
        }
        
        getData(){
            Hooks.on('closeConditionDialog', () =>{
                this.render(false);
            })
            super.getData();
            conditions = actor.getFlag("FateAddon","conditions");
            if (conditions==undefined){
                conditions = [];
            }
            var myContent = "";
            let table=`<table id="cview" border="1" cellspacing="0" cellpadding="4" style="width: 800px;">`;
            myContent+=`${table}<tr><td style="background: black; color: white;">Name</td><td style="background: black; color: white; width">Boxes</td><td style="background: black; color: white;">Description</td><td style="background: black; color: white;"></td></tr>`
            conditions.forEach(condition=>{
                myContent+=`<tr>`
                //elements required: name, boxes (marked appropriately), description, and delete button.
                let name = condition.name;
                myContent+=`<td>${name}</td>`
                let boxes = condition.boxes;
                myContent+=`<td><input type="number" ${FateAddon.style} id="${name}" value=${boxes.length}></input></td>`
                let description = condition.description;
                myContent+=`<td><textarea ${FateAddon.style} id="${name}">${description}</textarea></td>`
                myContent+=`<td><button buttontype="button" name="delete" id="${name}"><i class = "fas fa-trash"></button></td>`
                myContent+=`</tr>`
            });
            myContent+=`<tr><td colspan="4" align="center"><button type="button" id="addCondition" style="height:30px; width:200px">Add Condition</button></td></tr></table>`
            let content={content:`${myContent}`}

            return content;
        }

        activateListeners(html) {
            super.activateListeners(html);
            const deleteButton = html.find("button[name='delete']");
            const newButton = html.find("button[id='addCondition']");
            const inputboxes = html.find("input[type='number']");
            const nameboxes = html.find("input[type='text']");
            const descriptionboxes = html.find("textarea");
        
            deleteButton.on("click", event => this._onClickDeleteButton(event, html));
            newButton.on("click", event => this._onClickNewButton(event, html));
            inputboxes.on("change", event => this._onInputBoxesChange(event, html));
            nameboxes.on("change", event => this._onNameBoxesChange(event, html));
            descriptionboxes.on("change", event => this._onDescriptionBoxChange(event, html));
          }   

          async _onInputBoxesChange(event, html){
                var n = event.target.id;
                var boxes = parseInt(event.target.value);
                var boxArray = [];
                for (let i = 0;i<boxes;i++){
                    boxArray.push(false);
                }
                conditions.find(condition => condition.name==n).boxes=boxArray;
                await actor.unsetFlag("FateAddon","conditions");
                await actor.setFlag("FateAddon","conditions",conditions);
                //console.log(conditions);
                await game.socket.emit("module.FateAddon",{"Updated":true});
          }

          async _onClickDeleteButton(event, html){
              var n = event.target.id;
              var toGo = conditions.find(condition => condition.name==n);
              var index = conditions.indexOf(toGo);
              conditions.splice(index, 1);
              await actor.unsetFlag("FateAddon","conditions");
              await actor.setFlag("FateAddon","conditions",conditions);
              this.render(false);
          }

          async _onDescriptionBoxChange(event, html){
                var n = event.target.id;
                conditions.find(condition => condition.name==n).description=event.target.value;
                await actor.unsetFlag("FateAddon","conditions");
                await actor.setFlag("FateAddon","conditions",conditions);
          }

          async _onClickNewButton(event, html){
            class ConditionDialog extends Application {
                super(){
                }
                activateListeners(html) {
                    super.activateListeners(html);
                    const myButton = html.find("button[name='add']");
                    const boxesbox = html.find("input[type='number']");
                    const description = html.find("textarea");
                
                    myButton.on("click", event => this._onClickButton(event, html));
                  }   

                  //action to perform when the add button is pressed (add this condition to list of conditions)
                  async _onClickButton(event, html){
                      let name = html.find("input[id='cName']")[0].value.trim();
                      let numboxes = parseInt(html.find("input[id='boxes']")[0].value,10);
                      //console.log(numboxes);
                      let boxes = [];
                      for (let i = 0; i<numboxes; i++){
                            boxes.push(false);
                      }
                      let description = html.find("textarea")[0].value.trim();
                      let newCondition = {
                                            "name":name,
                                            "boxes":boxes,
                                            "description":description,
                                            "notes":""
                                        }
                        if (conditions==undefined){
                            conditions=[];
                        }

                        if (conditions.find(con => con.name == name)){
                            ui.notifications.error("Can't create duplicate condition.")
                        } else {
                            conditions.push(newCondition);
                            await actor.unsetFlag("FateAddon","conditions");
                            await actor.setFlag("FateAddon","conditions",conditions);
                        }                    
                        this.close();
                  }

                getData(){
                    super.getData();
                    conditions = actor.getFlag("FateAddon","conditions");
                    var myContent="";
                    myContent+=`<table border="1" cellspacing="0" cellpadding="4">`;
                    myContent+=`
                                <tr>
                                    <td style="background:black; color:white">
                                        Name:
                                    </td>
                                    <td>
                                        <input type="text" ${FateAddon.style} id="cName"></input>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="background:black; color:white">
                                        Boxes:
                                    </td>
                                    <td>
                                        <input type="number" ${FateAddon.style} id="boxes"></input>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="background:black; color:white">
                                        Description:
                                    </td>
                                    <td>
                                        <textarea ${FateAddon.style}>
                                        </textarea>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="2">
                                        <button type="button" name="add">Add Condition</button>
                                    </td>
                                </tr>`
                    myContent+="</table>";
                    let content={content:`${myContent}`}
                    return content;
                }
            }
            let opt=Dialog.defaultOptions;
            opt.resizable=false;
            opt.title=`Add a condition for ${actor.name}`;
            opt.width=300;
            opt.height=240;
            opt.minimizable=true;
            var cd;
            cd = new ConditionDialog(opt);
            cd.render(true);
          }
    }

    let opt=Dialog.defaultOptions;
    opt.resizable=true;
    opt.title=`View Stress and Conditions for ${actor.name}`;
    opt.width=825;
    opt.height=600;
    opt.minimizable=true;

    var viewer;
    viewer = new ConditionViewer(opt);
    viewer.render(true);
    game.socket.on("module.FateAddon", data => {
        viewer.render(false);
    })

    const delay = 200;

    Hooks.on('closeConditionEditor',async () => {
            await viewer.render(false);
    })

    Hooks.on('updateToken', (scene, token, data) => {
        if (data.actorData!=undefined){
            setTimeout(function(){viewer.render(false);},delay);
        }
    })
    Hooks.on('updateActor', () => {
        setTimeout(function(){viewer.render(false);},delay);
    })
}

Hooks.on('renderTokenHUD', function(hudButtons, html, data){
    if (true){
        let button = $(`<div class="control-icon whisperBox"><i class="fas fa-user-injured"></i></div>`);
        let col = html.find('.col.right');
        col.append(button);
     
        button.find('i').click(async (ev) => {
            tokenId=data._id;
            var actor = canvas.tokens.placeables.find(t => t.data._id == tokenId).actor;
            manageConditions(actor);
        });
    }
})

Hooks.on('ready', () => {
	game.settings.register("FateAddon", "pcondmanage", {
		name: "Players can manage conditions?",
		hint: "If this is set to false, players will not be able to manage their own existing conditions and you will need to do it for them.",
		scope: "world",
		config: true,
		default: true,
		type: Boolean
    });
    game.settings.register("FateAddon", "pcondedit", {
		name: "Players can edit conditions?",
		hint: "If this is set to false, players will not be able to add, edit, or delete their conditions and you will need to do it for them.",
		scope: "world",
		config: true,
		default: true,
		type: Boolean
    });
    game.settings.register("FateAddon", "usesheetstress", {
		name: "Use sheet stress?",
		hint: "If this is set to true, uses the stress boxes from the Core sheet rather than from Conditions.",
		scope: "world",
		config: true,
		default: false,
		type: Boolean
    });
})