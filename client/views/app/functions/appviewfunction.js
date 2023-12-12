window.appviewfunction = async function appviewfunction(runFunction){

    if(window.runFunction ==="functionBurst"){
        //call functions here
        console.log('ran appviewfunction from package');
    }   
    else {
        console.warn("appviewfunction view: runFunction not set, halting execution.");
    }
}
//define functions here
