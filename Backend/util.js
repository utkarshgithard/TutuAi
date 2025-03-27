
const uniqueId = ()=>{
    const string = '123456789abcedf'
    let id = ''
        for(let i=0;i<15;i++){
            id = id + string[Math.floor(Math.random() * 15)]
        }
    return id;
}

export {uniqueId};

