class FateAddon{
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
                hud.tools.push({
                    name:"ViewDebt",//Completed
                    title:"View a summary of Indebted for all tokens",
                    icon:"fas fa-file-invoice",
                    onClick: ()=> {viewDebt();},
                    button:true
                });
            }
                if(game.user.isGM){
                    hud.tools.push({
                        name:"setStress",//Completed
                        title:"Set stress boxes for the selected token",
                        icon:"fas fa-cogs",
                        onClick: ()=> {callSetStress();},
                        button:true
                    });
                    hud.tools.push({
                        name:"clearAllStress",//Completed
                        title:"Clear all stress for all tokens",
                        icon:"fas fa-medkit",
                        onClick: ()=> {clearAllStress();},
                        button:true
                    });
                    hud.tools.push({
                        name:"ManageDebt",//Completed
                        title:"Manage Indebted for the selected token",
                        icon:"fas fa-coins",
                        onClick: ()=> {manageDebt();},
                        button:true
                    });
                }
            }
    }

function callHit () {
    var actors = canvas.tokens.controlled;
    var table=`<table border="1" cellspacing="0" cellpadding="4" style="width: auto;">`;
    var pString = `<tr><td height="50" width="150" style="background: black; color: white;">Physical Stress:</td>`;
    var mString = `<tr><td height="50" width="150" style="background: black; color: white;">Mental Stress:</td>`;
    var mStress = 0;
    var pStress = 0;
    var pStressTaken = 0;
    var mStressTaken = 0;
    var fullCell=`<td height="50" width ="50" align="center">X</td>`;
    var emptyCell=`<td height="50" width ="50" align="center"></td>`;

    if (actors.length > 1 || actors.length === 0){
    var dp = {
        "title":"Error",
        "content":"Please select exactly one token and try again.<p>",
            default:"oops",
            "buttons":{
            oops:{label:"OK", callback:() => console.log("No token selected")}
            }}
    let d = new Dialog(dp);
    d.render(true);
    } else {
                async function hit (actor, stress, type){

                pStress = actor.getFlag("world","pStress");
                pStressTaken = actor.getFlag("world","pStressTaken");
                mStress = actor.getFlag("world","mStress");
                mStressTaken = actor.getFlag("world","mStressTaken");

                var items = actor.items;

                var item=actor.items.find(i=>i.type == "Extra" && i.name.includes("Stress"));
                if (item == null || item == undefined){
                    mStressTaken = 0;
                    pStressTaken = 0;
                    pStress = 3;
                    mStress = 3;
                    await actor.setFlag("world", "pStress",pStress);
                    await actor.setFlag("world","mStress",mStress);
                    await actor.setFlag("world","mStressTaken",0);
                    await actor.setFlag("world","pStressTaken",0);

                    await actor.createOwnedItem(
                        {
                                "type":"Extra",
                                "name":"Stress",
                                data: {
                                    description: {
                                        value:``
                                    }
                                }
                        });
                }
                item = await actor.items.find(i => i.type == "Extra" && i.name.includes("Stress"));
                
                if (type==="Physical")
                {
                    ChatMessage.create({content: `Hit ${actor.name} for ${stress} physical stress.`, speaker : { alias : "Game: "}})
                    if ((pStress - pStressTaken - stress) < 0)
                    {
                        ChatMessage.create({content: `${actor.name} doesn't have the free physical stress boxes to absorb a hit that big.`, speaker : { alias : "Game: "}})
                    }
                    else 
                    {
                        pStressTaken+=stress;
                        await actor.setFlag("world","pStressTaken",pStressTaken);
                    }
                }
                if (type==="Mental")
                {
                    ChatMessage.create({content: `Hit ${actor.name} for ${stress} mental stress.`, speaker : { alias : "Game: "}})
                    if ((mStress - mStressTaken - stress) < 0)
                    {
                        ChatMessage.create({content: `${actor.name} doesn't have the free mental stress boxes to absorb a hit that big.`, speaker : { alias : "Game: "}})
                    }
                    else 
                    {
                        mStressTaken+=stress;
                        await actor.setFlag("world","mStressTaken",mStressTaken);
                    }
                }
                var ptoMark = pStressTaken; 
                //console.log("PStress "+ pStress);

                    for (let i=0;i<pStress;i++)
                    {
                        if (ptoMark > 0)      
                        {
                            pString +=fullCell;
                            ptoMark --;
                        }
                        else 
                        {
                            pString +=emptyCell;
                        }
                    }

                    pString+="</tr>";

                    var mtoMark = mStressTaken;
                    for (let i=0;i<mStress;i++)
                    {
                        if (mtoMark > 0)      
                        {
                        mString += fullCell;
                        mtoMark --;
                        }
                        else 
                        {
                            mString +=emptyCell;
                        }
                    }   
                    item = await actor.items.find(i => i.type == "Extra" && i.name.includes("Stress"));
                    actor.updateEmbeddedEntity("OwnedItem", {_id : item._id, "data.description.value" : `<b>${table+pString+table+mString}</table></b>`});
                    //console.log(pString+" "+mString);
        }

        var buttonString="";
        var response;

        var buttons = {}
        let actor = actors[0].actor;

        var dialogParameters = {
            "title":"Inflict Stress",
            "content":`Specify the type of the attack, and then select how much stress to inflcit on ${actor.name}:<p>
                    <form>Physical:<input type="radio" name="type" id="isPhysical" value="Physical" checked="true">
                    Mental:<input type="radio" name="type" id="isMental" value="Mental" ><n><p></form>`,
                    "buttons":buttons
                    }

        for (let i=1;i<11;i++)
        {
                let buttonData = {"label":i,"callback":async () => {
                    let stressType=document.querySelector("input[name=type]:checked").value;
                    //console.log(stressType);
                    hit (actor, i, stressType);
                    }
                }
                //Add button to buttons
                let name="buttonP"+i;
                dialogParameters.buttons[name]=buttonData
        }     
        let d = new Dialog(dialogParameters);
        d.render(true);
    }
}

function viewStress(){
    
    //Hooks.on('renderDialog', ()=>{viewer.render(false);})

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

        prepareStress(){
            let tokens = canvas.tokens.placeables;
            let buttons= {}
            let actor;            
            let table=`<table border="1" cellspacing="0" cellpadding="4" style="width: auto;">`;
            let rows=[`<tr><td style="background: black; color: white;">Character</td><td style="background: black; color: white;">Physical Stress</td><td style="background: black; color: white;">Hits</td><td style="background: black; color: white;">Mental Stress</td><td style="background: black; color: white;">Hits</td><td style="background: black; color: white;">Mild</td><td style="background: black; color: white;">Mild</td><td style="background: black; color: white;">Moderate</td><td style="background: black; color: white;">Severe</td>`];
            for (let i=0;i<tokens.length;i++){
            let actor = tokens[i].actor;
            let consequences = actor.data.data.health.cons;
            let row = `<tr>
                        <td>${actor.name}</td>
                        <td>${actor.getFlag("world","pStress")}</td>
                        <td>${actor.getFlag("world","pStressTaken")}</td>
                        <td>${actor.getFlag("world","mStress")}</td>
                        <td>${actor.getFlag("world","mStressTaken")}</td>
                        <td>${consequences.mild.one}</td>
                        <td>${consequences.mild.two}</td>
                        <td>${consequences.moderate.value}</td>
                        <td>${consequences.severe.value}</td>
                    </tr>`
            rows.push(row);
            }
            let myContents=`${table}`;
            rows.forEach(element => myContents+=element)
            myContents+="</table>"
            return myContents;    
        }

        getData (){
            let content={content:`${this.prepareStress()}`}
            return content;
        }
    }

    //The following line would perform the code in the {}s whenever StressViewer is rendered.
    //Hooks.on('renderStressViewer', () => {console.log("Hooked")})

    let opt=Dialog.defaultOptions;
    opt.resizable=true;
    opt.title="View Stress and Consequences";
    opt.width=800;
    opt.height=640;
    opt.minimizable=true;

    var viewer;
    viewer = new StressViewer(opt);
    viewer.render(true);
}

function callSetStress(){
    var actors = canvas.tokens.controlled;
    var actor;

    if (actors.length > 1 || actors.length === 0) {
        var dp = {
            "title": "Error",
            "content": "Please select exactly one token and try again.<p>",
            "buttons": {
                oops: {
                    label: "OK",
                    callback: () => console.log("")
                }
            }
        }
        let d = new Dialog(dp);
        d.render(true);
    } else {
        actor = actors[0].actor;
        var buttonString = "";
        var response;
        var buttons = {}

        var dialogParameters = {
            "title": "Set Physical Stress Boxes",
            "content": `Select how many stress boxes ${actor.name} should have:<p><n>
                    <form><table cellspacing="0" cellpadding="4" style="width: auto;"><tr><td>Physical:</td><td><input type="number" id="pstressbox" value="3"></td></tr>
                    <tr><td>Mental:</td><td><input type="number" id="mstressbox" value="3"></p></td></table></form>`,
            "buttons": buttons,
            default:"setS"
        }

        function setStress(actor, pStress, mStress) {

            actor.setFlag("world", "pStress", pStress);
            actor.setFlag("world", "pStressTaken", 0);
            actor.setFlag("world", "mStress", mStress);
            actor.setFlag("world", "mStressTaken", 0);

            var emptyCell = `<td height="20" width="50"></td>`;
            var table = `<table border="1" cellspacing="0" cellpadding="4" style="width: auto;">`;
            var pString = `<tr><td height="50" width="150" style="background: black; color: white;">Physical Stress:</td>`;
            var mString = `<tr><td height="50" width="150" style="background: black; color: white;">Mental Stress:</td>`;
            var items;

            for (var i = 0; i < pStress; i++) {
                pString += emptyCell;
            }
            pString += "</tr>";

            for (i = 0; i < mStress; i++) {
                mString += emptyCell;
            }

            items = actor.items;

            let item = actor.items.find(i => i.type == "Extra" && i.name.includes("Stress"));

            //Initialise the Stress sheet if this character doesn't already have one.
            if (item == null || item == undefined) {
                actor.createOwnedItem({
                    "type": "Extra",
                    "name": "Stress",
                    data: {
                        description: {
                            value: `<b>${table+pString}</table>${table+mString}</table></b>`
                        }
                    }
                });
            } else {
                if (item != null && item != undefined) {
                    actor.updateEmbeddedEntity("OwnedItem", {
                        _id: item._id,
                        "data.description.value": `<b>${table+pString+table+mString}</table></b>`
                    });
                }
            }

        }

        let buttonData = {
            "label": "Set Stress Boxes",
            "callback": () => setStress(actor,
                document.getElementById("pstressbox").value, document.getElementById("mstressbox").value)
        }
        dialogParameters.buttons["setS"] = buttonData;

        let d = new Dialog(dialogParameters);
        d.render(true);
    }
}

function clearAllStress(){
            // Clear the stress boxes of all actors and initialise stress to 3/3 for anyone without stress boxes currently.
            ChatMessage.create({content: "Clearing all stress boxes!", speaker : { alias : "Game: "}})

    var tokens = canvas.tokens.placeables;

    for (let i = 0; i < tokens.length; i++) {

        var token = tokens[i];
        var actor = token.actor;
        actor.setFlag("world", "pStressTaken", 0);
        actor.setFlag("world", "mStressTaken", 0);
        var pStress = actor.getFlag("world", "pStress");
        var mStress = actor.getFlag("world", "mStress");
        var emptyCell = `<td height="50" width="50"></td>`;

        var table = `<table border="1" cellspacing="0" cellpadding="4" style="width: auto;">`;
        var pString = `<tr><td height="50" width="150" style="background: black; color: white;">Physical Stress:</td>`;
        var mString = `<tr><td height="50" width="150" style="background: black; color: white;">Mental Stress:</td>`;

        //Initialise stress to defaults of 3 if this character doesn't have any stress already defined.
        if (pStress == undefined) {
            pStress = 3;
        }
        if (mStress == undefined) {
            mStress = 3;
        }
        actor.setFlag("world", "pStress", pStress);
        actor.setFlag("world", "mStress", mStress);

        for (let i = 0; i < pStress; i++) {
            pString += emptyCell;
        }
        pString += `</tr>`;

        for (let i = 0; i < mStress; i++) {
            mString += emptyCell;
        }
        var item = actor.items.find(i => i.type == "Extra" && i.name.includes("Stress"));

        //Initialise the Stress sheet if this character doesn't already have one.
        if (item == null || item == undefined) {
            actor.createOwnedItem({
                "type": "Extra",
                "name": "Stress",
                data: {
                    description: {
                        value: `<b>${table+pString}</table>${table+mString}</table></b>`
                    }
                }
            });
        } else {
            if (item != null && item != undefined) {
                actor.updateEmbeddedEntity("OwnedItem", {
                    _id: item._id,
                    "data.description.value": `<b>${table+pString+table+mString}</table></b>`
                });
            }
        } //End Stress Initialising
    }
}

function manageDebt(){
    var debtors = canvas.tokens.controlled;
    var table = `<table border="1" cellspacing="0" cellpadding="4" style="width: auto"><tr><td height="50" width="200" style="background: black; color: white;" align="center">Indebted to:</td></tr>`;
    var debtString = table;
    var buttonString = "";
    var debts;
    var dialogParameters;
    var buttons = {};

    function getCell(text) {
        return `<tr><td height="50" width ="150" align="center">${text}</td></tr>`;
    }

    if (debtors.length > 1 || debtors.length === 0) {
        var dp = {
            "title": "Error",
            "content": "Please select exactly one token and try again.<p>",
            default:"oops",
            "buttons": {
                oops: {
                    label: "OK",
                    callback: () => console.log("No token selected")
                }
            }
        }
        let d = new Dialog(dp);
        d.render(true);
    } else {
        //Get the actor we're working on
        let debtor = debtors[0].actor;
        console.log("Debtor ID "+ debtor.data._id);

        //Initialise this actor's Indebted if they don't already have an Indebted flag.
        debts = debtor.getFlag("world", "Indebted");
        if (debts === null || debts === undefined) {
            debts = ["", "", "", "", ""];
            async () => await debtor.setFlag("world", "Indebted", debts);
        }

        //Create a button that saves the contents of the Indebted track back as an array to the debtor's Indebted flag.
        let buttonData = {
            "label": "Save Changes",
            "callback": async () => {

                debts[0] = document.getElementById("debt1").value;
                debts[1] = document.getElementById("debt2").value;
                debts[2] = document.getElementById("debt3").value;
                debts[3] = document.getElementById("debt4").value;
                debts[4] = document.getElementById("debt5").value;
                debtor.setFlag("world", "Indebted", debts)

                //Render the character's current Indebted track back to their character sheet
                debts.sort().reverse();

                let item = debtor.items.find(i => i.type == "Extra" && i.name.includes("Indebted"));

                for (var i = 0; i < debts.length; i++) {
                    debtString += `${getCell(debts[i])}`;
                }
                debtString += "</tr></table>";

                //Initialise the Indebted sheet if this character doesn't already have one.
                if (item == null || item == undefined) {
                    
                    await debtor.createOwnedItem({ 
                        "type": "Extra",
                        "name": "Indebted",
                        data: {
                            description: {
                                chat: "[Indebted] I enter chat",
                                unidentified: "[Indebted] unidentified",
                                value: `<b>${debtString}</b>` 
                            }
                        }
                    });
                    item = debtor.items.find(i => i.type == "Extra" && i.name.includes("Stress"));
                } else {
                    await debtor.updateEmbeddedEntity("OwnedItem", {
                        _id: item._id, "data.description.value":
                        `<b>${debtString}</b>`
                    });
                } //End IndebtedInitialising
            }
        };
        //Create dialog with five text fields containing the current values of the debtor's Indebted track
        dialogParameters = {
            "title": `Manage ${debtor.name}'s Indebted Track`,
            "content": `Edit ${debtor.name}'s debts, then push the button to save them.<p><n>
                                        <form><p><input type="text" id="debt1" value=${debts[0]}>
                                        <p><input type="text" id="debt2" value=${debts[1]}>
                                        <p><input type="text" id="debt3" value=${debts[2]}>
                                        <p><input type="text" id="debt4" value=${debts[3]}>
                                        <p><input type="text" id="debt5" value=${debts[4]}>
                                        </form>`,
            "buttons": buttons,
            default:"manageDebt"
        }

        dialogParameters.buttons["manageDebt"] = buttonData;
        let d = new Dialog(dialogParameters);
        d.render(true);
    }
}

function viewDebt(){
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


    class DebtViewer extends Application {
        static myContents;
        super(options){
        }

        prepareDebt(){
            let tokens = canvas.tokens.placeables;
            let buttons = {}
            let myContents;
            let debts;
            let actor;
            let table = `<table border="1" cellspacing="0" cellpadding="4" style="width: auto;">`;
            let rows = [`<tr><td style="background: black; color: white;">Character</td><td style="background: black; color: white;">Debt 1</td><td style="background: black; color: white;">Debt 2</td><td style="background: black; color: white;">Debt 3</td><td style="background: black; color: white;">Debt 4</td><td style="background: black; color: white;">Debt 5</td>`];

            for (let i = 0; i < tokens.length; i++) {
                let actor = tokens[i].actor;

                //Initiatlise debt if this actor doesn't have the flag already
                
                debts = actor.getFlag("world", "Indebted");

                if (debts === null || debts === undefined) {
                    debts = ["", "", "", "", ""];

                    async()=> {await actor.setFlag("world", "Indebted", debts)}
                }

                let row = `<tr><td height="50" width="150">${actor.name}</td><td height="50" width="150">${debts[0]}</td><td height="50" width="150">${debts[1]}</td><td height="50" width="150">${debts[2]}</td><td height="50" width="150">${debts[3]}</td><td height="50" width="150">${debts[4]}</td></row>`
                rows.push(row);
            }
            myContents = `${table}`;
            rows.forEach(element => myContents += element)
            myContents += "</table>"
            return myContents;
        }
        getData (){
            let content={content:`${this.prepareDebt()}`}
            return content;
        }
    }

    let opt=Dialog.defaultOptions;

    opt.resizable=true;
    opt.title="View Indebted";
    opt.width=800;
    opt.height=300;
    opt.minimizable=true;

    let viewer = new DebtViewer(opt);
    viewer.render(true);
}

Hooks.on('getSceneControlButtons', function(hudButtons)
{
    FateAddon.prepareButtons(hudButtons);
})

