const Menu = require('../../models/menu')

function homeController() {
    
    return{
        index(req,res){

            Menu.find().then(function(foundFoods) {
                //console.log(foundFoods);
                return res.render('home',{foods: foundFoods});
            })
        }
    }

}

module.exports=homeController