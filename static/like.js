let add = document.querySelectorAll('.add-likes');


function updateLike(blogs){
    axios.post('/update-likes',blogs).then(res=>{
        console.log(res)
    })
}

add.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        let blogs = JSON.parse(btn.dataset.products)
        console.log(blogs)
        updateLike(blogs)
    })
})