import React from 'react';
import ReactDOM from 'react-dom';

import Url from 'domurl';
import Page from './Page';
import { loadConfig } from './config';
import './index.css';

import {
    ReviewPageBuilder
} from './pages/ReviewPage/ReviewPage.js';

import {
    EvaluationResultsPageBuilder
} from './pages/EvaluationResultsPage/EvaluationResultsPage.js';

import {
    PracticePageBuilder
} from './pages/PracticePage/PracticePage.js';

import {
    ErrorPageBuilder
} from './pages/ErrorPage/ErrorPage.js';

import {
    FAQPageBuilder
} from './pages/FAQPage/FAQPage.js';

import {
    TheoryPageBuilder
} from './pages/TheoryPage/theory.js';

import {
    LoginPageBuilder
} from './pages/LoginPage/LoginPage.js';

import {
    LogoutPageBuilder
} from './pages/LogoutPage/LogoutPage.js';

import SplashPage from './pages/SplashPage/SplashPage.js';

import PageLabels from './components/PageLabels/PageLabels.js';
import { EvaluationPageBuilder } from './pages/EvaluationPage/EvaluationPage';
import { ProfilePageBuilder } from './pages/ProfilePage/ProfilePage';

var scriptsLoaded = 0;
var scriptsToLoad = 5;

async function main() {
    // URL Mapping for PageLabels
    var url = new Url();

    // Bootstrapping for CVPageBuilder
    var builder = getBuilder(url);
    var result = await builder.onPageLoad(url);

    // If there was an error in the onPageLoad functiom, show an error page
    var error = false;
    if (result === false) {
        error = true;
        builder = new ErrorPageBuilder();
    }

    window.onbeforeunload = function () {
        if (builder.onPageClose !== undefined) {
            builder.onPageClose();
        }
    };

    if (typeof builder.rerenderOnUserLoaded === 'function' && builder.rerenderOnUserLoaded() === true) {
        setInterval(function () {
            if (window.user !== undefined && window.user.inited === true && !this.userObjectExistsYet) {
                this.userObjectExistsYet = true;
                renderPage(builder, error);
            }
        }, 25);
    }

    renderPage(builder, error);


}

function renderPage(builder, error) {

    // URL Mapping for PageLabels
    var url = new Url();
    var path = url.path.replace("/", "");
    var components = path.split("/");
    let theoryStr = 'subpages-header-col ';
    let practiceStr = 'subpages-header-col ';
    let faqStr = 'subpages-header-col ';

    if (components[0] === 'review' || components[0] === 'practice' ||
        components[0] === "evaluate" || components[0] === "") {
        practiceStr += 'activated';
    } else if (components[0] === 'theory') {
        theoryStr += 'activated';
    } else if (components[0] === 'faq') {
        faqStr += 'activated';
    }

    ReactDOM.render(
        <Page
            lead={
                builder.pageLead("next")
            }
            content={
                builder.pageContent()
            }
            pageLabels={
                (!error) ?
                    <PageLabels theory={theoryStr}
                        practice={practiceStr}
                        faqs={faqStr}
                    /> : null
            }
        />,
        document.getElementById("root")
    );

    // Sometimes a page will want to redirect,
    // Give them that chance right after rendering the page
    var once = false;
    setInterval(function () {
        if (window.loggedIn !== undefined && !once) {
            if (typeof builder.allowRedirectIfDesired === "function") {
                once = true;
                builder.allowRedirectIfDesired()
            }
        }
    }, 25);
}

// Returns a CVPageBuilder object, based on the current URL of the page
function getBuilder() {
    var url = new Url();
    var path = url.path.replace("/", "");
    var components = path.split("/");

    switch (components[0]) {
        case "review":
            return new ReviewPageBuilder();
        case "results":
            return new EvaluationResultsPageBuilder();
        case "practice":
        case "": // for base url (which is practice)
            return new PracticePageBuilder();
        case "evaluate":
            return new EvaluationPageBuilder();
        case "faq":
            return new FAQPageBuilder();
        case "theory":
            return new TheoryPageBuilder();
        case "login":
            return new LoginPageBuilder();
        case "logout":
            return new LogoutPageBuilder();
        case "profile":
            return new ProfilePageBuilder();
        default:
            return new ErrorPageBuilder();
    }
}

function scriptLoaded() {
    scriptsLoaded++;
    if (scriptsLoaded === scriptsToLoad) {
        main();
    }
}

function loadJS(url, implementationCode, location) {
    var scriptTag = document.createElement('script');
    scriptTag.src = url;
    scriptTag.onload = implementationCode;
    scriptTag.onreadystatechange = implementationCode;
    location.appendChild(scriptTag);
}

window.rootURL = 'http://localhost:3000'

loadConfig();
loadJS('https://unpkg.com/deepmerge@3.2.0/dist/umd.js', scriptLoaded, document.body);
loadJS(`${window.serverLocation}:4567/config.js`, scriptLoaded, document.body);
loadJS(`${window.serverLocation}:4567/classes/APIRequest.js`, scriptLoaded, document.body);
loadJS(`${window.serverLocation}:4567/classes/Loan.js`, scriptLoaded, document.body);
loadJS(`${window.serverLocation}:4567/classes/User.js`, scriptLoaded, document.body);

// Render some initial content in the meantime
ReactDOM.render(
    <SplashPage />,
    document.getElementById("root")
);
