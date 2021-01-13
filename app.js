const YNAB = require('ynab')
const utils = require('ynab').utils

const accessToken = require('./config.json').token
const YNABAPI = new YNAB.API(accessToken)

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

async function getBudget(name) {
    const budgetResponse = await YNABAPI.budgets.getBudgets();
    return budgetResponse.data.budgets.filter( b => b.name == name )
}

async function getCategories(budgetId){
    const catResponse = await YNABAPI.categories.getCategories(budgetId)
    categories = []
    for (let catGroup of catResponse.data.category_groups){
        for (let category of catGroup.categories){
            categories.push(category)
        }
    }
    return categories
}

function is_coming_up(category){
    let goal_date = utils.convertFromISODateString(category.goal_target_month)
    let today = new Date()
    let target = new Date().addDays(10)
    return (goal_date >= today && goal_date < target)
}

async function selections(categories){
            var data = await categories.filter(c => is_coming_up(c) )
            await console.log("DATA",data)
            return data
}

getBudget("Bauman Family Budget")
.then( x => getCategories(x[0].id) )
.then( y => selections(y) )
.then( z => {

    for (cat of z){
        console.log(cat.goal_target_month)
    }
})
.catch ( err => console.log("Error", err))