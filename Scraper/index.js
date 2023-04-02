import puppeteer from 'puppeteer';
import fs from 'fs';

import { ids } from './ids.js'


(async() => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    let objArray = [];
    for (let i = 0; i < ids.length - 1; i++) {
        const myObj = {};
        myObj.Id=ids[i];
        await page.goto(`https://niagarahistorical.pastperfectonline.com/archive/${ids[i]}`);
        const data = await page.evaluate(
            () => Array.from(
                document.querySelectorAll('table > tbody > tr'),
                row => Array.from(row.querySelectorAll('th, td'), cell => cell.innerText)
            )
        );
        const imgs = await page.$$eval('.relatedPhotos img[src]', imgs => imgs.map(img => img.getAttribute('src')));

        // console.log(imgs)
        data.forEach(arr => myObj[arr[0]] = arr[1]);
        myObj.images = imgs;
        objArray.push(myObj);
    }

    fs.writeFile('./finalObj.txt', JSON.stringify(objArray), err => {
      if (err) {
        console.error(err);
      }
      // file written successfully
    });

    // console.log(myObj);

    // console.log(ids[0])




    /////////////////////////////////////////////////////////////////////////////
    // //https://niagarahistorical.pastperfectonline.com/Archive?page=2&onlyimages=False
    // let finalArr = [];
    // for (let i = 1; i <= 113; i++) {
    //     await page.goto(`https://niagarahistorical.pastperfectonline.com/Archive?page=${i}&onlyimages=False`);

    //    // Set screen size
    //     await page.setViewport({ width: 1300, height: 1024 });

    //     const hrefs1 = await page.evaluate(
    //         () => Array.from(
    //             document.querySelectorAll('a[href]'),
    //             a => a.getAttribute('href')
    //         ).map(x => x.toUpperCase()).filter(hre => hre.includes('ARCHIVE/'))
    //         .map(x => x.substring(9))
    //     );
    //     const uniqueArray = [...new Set(hrefs1)];
    //     finalArr.push(...uniqueArray);
    ///////////////////////////////////////////////////////////////////////////////////
    // }




    // fs.writeFile('./paths.txt', JSON.stringify(finalArr), err => {
    //   if (err) {
    //     console.error(err);
    //   }
    //   // file written successfully
    // });



    await browser.close();
})();



//   // Type into search box
//   await page.type('.search-box__input', 'automate beyond recorder');

//   // Wait and click on first result
//   const searchResultSelector = '.search-box__link';
//   await page.waitForSelector(searchResultSelector);
//   await page.click(searchResultSelector);

//   // Locate the full title with a unique string
//   const textSelector = await page.waitForSelector(
//     'text/Customize and automate'
//   );
//   const fullTitle = await textSelector.evaluate(el => el.textContent);

//   // Print the full title
//   console.log('The title of this blog post is "%s".', fullTitle);