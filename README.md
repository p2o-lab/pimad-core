# PiMAd-core
**P**rocess**i**ndustry-**M**odular-**A**utomation-**d**escription: High level access to automation of modular plants.  
## LICENSING
There may be SEMODIA content in this repository and the commit history. Therefore, a release on a public platform like GitHub or NPM is **strictly forbidden**!

## development
Working so far on Ubuntu 18.04 LTS, 
### prerequisites
Install NPM via [Node.js](https://www.npmjs.com/get-npm) for your operating system (The LTS version should meet our requirements). Check the version of Node.js and NPM on your machine.
```shell script
# Node.js:
node -v
# NPM
npm -v
```  
Next step is installing the dependencies via NPM.
```shell script
npm install
``` 
Awesome. We are ready to code! You may install an IDE like [WebStorm](https://www.jetbrains.com/de-de/webstorm/): The many little helpers make programming more pleasant. 
### testing & linting
Understanding the use of Test-Driven-Development and linters please feel free to consult the [PiMAd-doc](https://dev.plt.et.tu-dresden.de/modulare-automation/PiMAd-doc) at the *Contribution* section.
```shell script
# run tests + code coverage report
npm run test
# run linter
npm run lint
```
Afterwards you will find the web-page based coverage report in the folder **coverage**. The entry point is **coverage/index.html**. 
### build the application
Converting the TypeScript-code into plain JavaScript. 
```shell script
npm run build
```
### run the application
W.I.P. Actually there is no real entry point :poop:
```shell script
npm run start
```
## documentation
Web-page based documentation will be build via 
```shell script
npm run build-gdocs
```
Afterwards you will find a folder **docs** in your project directory. The documentation entry point is **docs/index.html**. 

---
Coded with :heart: by @cheidelbach