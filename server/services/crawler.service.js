const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

async function getGoogleSearchResults(query) {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    await page.goto(searchUrl, { waitUntil: 'domcontentloaded' });

    const searchResults = await page.evaluate(() => {
        const results = [];
        document.querySelectorAll('a h3').forEach((el) => {
            const parent = el.closest('a');
            if (parent) {
                results.push({
                    title: el.innerText,
                    link: parent.href,
                });
            }
        });
        return results;
    });

    await browser.close();
    return searchResults;
}

async function getIngredientsFromPage(url) {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        
        // Sample selectors - Customize based on the website's structure
        const ingredients = [];
        $('p, li').each((i, elem) => {
            const text = $(elem).text().toLowerCase();
            console.log(text)
            if (text.includes('ingredients:') || text.includes('active ingredients')) {
                ingredients.push(text.replace(/.*ingredients:\s*/, ''));
            }
        });

        return ingredients.length ? ingredients : ['No ingredients found'];
    } catch (error) {
        console.error(`Error fetching ${url}:`, error.message);
        return [];
    }
}

async function findMedicineIngredients(medicineName) {
    // console.log(medicineName)
    const searchQuery = `${medicineName} ingredients site:drugs.com OR site:webmd.com OR site:rxlist.com`;
    const searchResults = await getGoogleSearchResults(searchQuery);

    const ingredientsData = [];
    for (const result of searchResults.slice(0, 3)) {
        const ingredients = await getIngredientsFromPage(result.link);
        ingredientsData.push({
            site: result.link,
            ingredients: ingredients,
        });
    }

    return ingredientsData;
}


module.exports= {findMedicineIngredients}