// ==UserScript==
// @name         dashboard unfucker
// @version      3.2.1
// @description  no more shitty twitter ui for pc
// @author       dragongirlsnout
// @match        https://www.tumblr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tumblr.com
// @downloadURL  https://raw.githubusercontent.com/enchanted-sword/dashboard-unfucker/main/unfucker.user.js
// @updateURL    https://raw.githubusercontent.com/enchanted-sword/dashboard-unfucker/main/unfucker.user.js
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.4.min.js
// @run-at       document-start
// ==/UserScript==

/* globals tumblr */

'use strict';

const version = "3.2.1";
const type = "a";
const updateSrc = "https://raw.githubusercontent.com/enchanted-sword/dashboard-unfucker/main/unfucker.user.js"

const storageAvailable = (type) => { //thanks mdn web docs!
    let storage;
    try {
        storage = window[type];
        const x = "__storage_test__";
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    } catch (e) {
        return (
            e instanceof DOMException && (
                e.code === 22 ||
                e.code === 1014 ||
                e.name === "QuotaExceededError" ||
                e.name === "NS_ERROR_DOM_QUOTA_REACHED"
            ) &&
            storage &&
            storage.length !== 0
        );
    }
}

var featureSet = [{"name": "adFreeCtaBanner", "value": false}];

if (storageAvailable("localStorage") && JSON.parse(localStorage.getItem("configPreferences")).length === 13) {
    let pref = JSON.parse(localStorage.getItem("configPreferences"));
    if (pref[5].value === "checked") {
        featureSet.push({"name": "redpopDesktopVerticalNav", "value": false});
    }
    if (pref[6].value === "checked") {
        featureSet.push([
            {"name": "liveStreaming", "value": false},
            {"name": "liveStreamingWeb", "value": false},
            {"name": "liveCustomMarqueeData", "value": false},
            {"name": "liveStreamingWebPayments", "value": false}
        ]);
    }
    if (pref[7].value === "checked") {
        featureSet.push({"name": "domainsSettings", "value": false});
    }
    if (pref[8].value === "checked") {
        featureSet.push({"name": "activityRedesignM3", "value": false});
    }
    if (pref[9].value === "checked") {
        featureSet.push({"name": "messagingRedesign", "value": false});
    }
    if (pref[10].value === "checked") {
        featureSet.push({"name": "experimentalBlockEditorIsOnlyEditor", "value": false});
    }
    if (pref[11].value === "checked") {
        featureSet.push({"name": "configurableTabbedDash", "value": true});
    }
    if (pref[12].value === "checked") {
        featureSet.push([
            {"name": "crowdsignalPollsNpf", "value": true},
            {"name": "crowdsignalPollsCreate", "value": true},
            {"name": "allowAddingPollsToReblogs", "value": true}
        ]);
    }
} else {
    featureSet = [
        {"name": "redpopDesktopVerticalNav", "value": false},
        {"name": "liveStreaming", "value": false},
        {"name": "liveStreamingWeb", "value": false},
        {"name": "liveCustomMarqueeData", "value": false},
        {"name": "liveStreamingWebPayments", "value": false},
        {"name": "domainsSettings", "value": false},
        {"name": "activityRedesignM3", "value": false},
        {"name": "messagingRedesign", "value": false},
        {"name": "experimentalBlockEditorIsOnlyEditor", "value": false},
        {"name": "configurableTabbedDash", "value": true},
        {"name": "crowdsignalPollsNpf", "value": true},
        {"name": "crowdsignalPollsCreate", "value": true},
        {"name": "allowAddingPollsToReblogs", "value": true},
        {"name": "adFreeCtaBanner", "value": false}
    ]
}

const modifyObfuscatedFeatures = (obfuscatedFeatures, featureSet) => {
    let obf = JSON.parse(atob(obfuscatedFeatures)); // convert from base64, parse from string
    for (let x of featureSet) {
        console.log(x)
        obf[x.name] = x.value;
    }
    console.log(obf);
    return btoa(JSON.stringify(obf)); // compress back to string, convert to base64
};

if (!window.___INITIAL_STATE___) {
    let state;
    Object.defineProperty(window, "___INITIAL_STATE___", { // thanks twilight-sparkle-irl!
        set(x) {
            state = { ...x };
            try {
                state.obfuscatedFeatures = modifyObfuscatedFeatures(state.obfuscatedFeatures, featureSet);
            } catch (e) {
                console.error("Failed to modify features", e);
            }
        },
        get() {
            return state;
        },
        enumerable: true,
        configurable: true
    });
}
else {
    let obfuscatedFeatures;
    try {
        obfuscatedFeatures = modifyObfuscatedFeatures(window.___INITIAL_STATE___.obfuscatedFeatures, featureSet);
    } catch (e) {
        console.error("Failed to modify features", e);
    }
    Object.defineProperty(window.___INITIAL_STATE___, "obfuscatedFeatures", {
        get() {
            return obfuscatedFeatures;
        },
        enumerable: true,
        configurable: true
    });
}

var $ = window.jQuery;

const waitFor = (selector, retried = 0,) => new Promise((resolve) => {
    if ($(selector).length) { resolve() } else if (retried < 25) { requestAnimationFrame(() => waitFor(selector, retried + 1).then(resolve)) }
});

waitFor("head").then(() => {
    const style = document.createElement("style");
    style.innerHTML = `
        #adBanner + div:not(#glass-container) > div:first-child {
            z-index: 100;
            border-bottom: 1px solid rgba(var(--white-on-dark),.13) !important;
            position: -webkit-sticky !important;
            position: sticky !important;
            top: 0 !important;
            min-height: unset !important;
            background-color: RGB(var(--navy));
        }
    `;
    document.head.appendChild(style);
});

const updatePreferences = (arr) => {
    localStorage.setItem("configPreferences", JSON.stringify(arr))
}

$(document).ready(() => {
    getUtilities().then(({ keyToCss }) => {
        var $styleElement = $("<style id='__s'>");
        $styleElement.appendTo("html");
        $styleElement.text(`
            #__m { margin-bottom: 20px; }
            #__in {
                padding: 8px;
                font-weight: bold;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            #__in h1 {
                color: rgb(var(--white-on-dark));
                font-size: 1.2em;
                display: inline;
            }
            #__m ul {
                margin: 4px;
                padding: 0;
                background: RGB(var(--white));
                border-radius: 3px;
            }
            #__m li {
                list-style-type: none;
                padding: 8px 12px;
                border-bottom: 1px solid rgba(var(--black),.07);
                display: flex;
                align-items: center;
                justify-content: space-between;
                color: rgb(var(--black));
            }
            li.infoHeader {
                background: rgba(var(--black),.07);
                padding: 12px 12px;
                font-weight: bold;
            }
        `);

        function checkboxEvent(id, value) {
            if (id === "__c1") {
                $(keyToCss("timelineHeader")).toggle(!value);
            } else if (id === "__c2") {
                $(keyToCss("sidebarItem")).has(keyToCss("recommendedBlogs")).toggle(!value);
            } else if (id === "__c3") {
                $(keyToCss("sidebarItem")).has(keyToCss("radar")).toggle(!value);
            } else if (id === "__c4") {
                $(keyToCss("menuContainer")).has('use[href="#managed-icon__explore"]').toggle(!value);
            } else if (id === "__c5") {
                $(keyToCss("menuContainer")).has('use[href="#managed-icon__shop"]').toggle(!value);
            }
        }

        async function $unfuck() {
            if ($("#__c").length) {
                console.log("page already processed")
                return
            } else if (["/dashboard", "/"].includes(location.pathname) && $(keyToCss("timeline")).attr("data-timeline").split("?")[0] === "/v2/tabs/for_you") {
                window.tumblr.navigate("/dashboard/following");
                console.log("navigating to following");
                throw "navigating tabs";
            } else if (!$(keyToCss("main")).length) {
                console.log("page not loaded, retrying...");
                throw "page not loaded";
            } else { console.log("unfucking dashboard...") }
            if ("/dashboard/following" === location.pathname) {
                waitFor(keyToCss("timelineOptions")).then(() => {
                    if ($(keyToCss("timelineOptionsItemWrapper")).first().has("a[href='/dashboard/stuff_for_you']").length ? true : false) {
                        var $forYou = $(keyToCss("timelineOptionsItemWrapper")).has("a[href='/dashboard/stuff_for_you']");
                        var $following = $(keyToCss("timelineOptionsItemWrapper")).has("a[href='/dashboard/following']");
                        $forYou.insertAfter($following);
                    }
                });
            }
            var configPreferences = [
                { type: "checkbox", value: "checked" },
                { type: "checkbox", value: "checked" },
                { type: "checkbox", value: "checked" },
                { type: "checkbox", value: "checked" },
                { type: "checkbox", value: "checked" },
                { type: "checkbox", value: "checked" },
                { type: "checkbox", value: "checked" },
                { type: "checkbox", value: "checked" },
                { type: "checkbox", value: "checked" },
                { type: "checkbox", value: "checked" },
                { type: "checkbox", value: "checked" },
                { type: "checkbox", value: "checked" },
                { type: "checkbox", value: "checked" }
            ];
            if (storageAvailable("localStorage")) {
                if (!localStorage.getItem("configPreferences") || JSON.parse(localStorage.getItem("configPreferences")).length < configPreferences.length) {
                    updatePreferences(configPreferences)
                } else {
                    configPreferences = JSON.parse(localStorage.getItem("configPreferences"));
                }
            }
            var match = [
                "",
                "dashboard",
                "settings",
                "blog",
                "domains",
                "search",
                "likes",
                "following",
                "inbox",
                "tagged",
                "explore",
                "reblog"
            ];
            var $menu = $(`
                <div id="__m">
                    <div id="__in">
                        <h1>dashboard unfucker v${version}a</span></h1>
                        <button id="__ab">
                            <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" role="presentation" style="--icon-color-primary: rgba(var(--white-on-dark), 0.65);">
                                <use href="#managed-icon__ellipsis"></use>
                            </svg>
                        </button>
                        <button id="__cb">
                            <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" role="presentation" style="--icon-color-primary: rgba(var(--white-on-dark), 0.65);">
                                <use href="#managed-icon__settings"></use>
                            </svg>
                        </button>
                    </div>
                    <div id="__a" style="display: none;">
                        <ul id="__am">
                            <li class="infoHeader">
                                <span>about</span>
                            </li>
                            <li style="flex-flow: column wrap">
                                <span style="width: 100%;">version: <b>v${version}a</b></span><br>
                                <span style="width: 100%;">type "<b>a</b>" uses window property feature toggles. if you persistently encounter errors with the script, try type <b>\"b\"</b></span>
                            </li>
                            <li>
                                <a target="_blank" href="https://github.com/enchanted-sword/dashboard-unfucker">source</a>
                            </li>
                            <li>
                                <a target="_blank" href="https://github.com/enchanted-sword/dashboard-unfucker/issues/new">report a bug</a>
                            </li>
                            <li>
                                <a target="_blank" href="${updateSrc}">update</a>
                            </li>
                            <li>
                                <a target="_blank" href="https://tumblr.com/dragongirlsnout">my tumblr!</a>
                            </li>
                        </ul>
                    </div>
                    <div id="__c" style="display: none;">
                        <ul id="__ct">
                            <li class="infoHeader">
                                <span>general configuration</span>
                            </li>
                            <li>
                                <span>hide dashboard tabs</span>
                                <input class="configInput" type="checkbox" id="__c1" name="0" ${configPreferences[0].value}>
                            </li>
                            <li>
                                <span>hide recommended blogs</span>
                                <input class="configInput" type="checkbox" id="__c2" name="1" ${configPreferences[1].value}>
                            </li>
                            <li>
                                <span>hide tumblr radar</span>
                                <input class="configInput" type="checkbox" id="__c3" name="2" ${configPreferences[2].value}>
                            </li>
                            <li>
                                <span>hide explore</span>
                                <input class="configInput" type="checkbox" id="__c4" name="3" ${configPreferences[3].value}>
                            </li>
                            <li>
                                <span>hide tumblr shop</span>
                                <input class="configInput" type="checkbox" id="__c5" name="4" ${configPreferences[4].value}>
                            </li>
                        </ul>
                        <ul id="__cta">
                            <li class="infoHeader" style="flex-flow: column wrap">
                                <span style="width: 100%;">advanced configuration</span>
                                <span style="width: 100%; font-size: .8em;">requires a page reload</span>
                            </li>
                            <li>
                                <span>revert vertical nav layout</span>
                                <input class="configInput" type="checkbox" id="__c6" name="5" ${configPreferences[5].value}>
                            </li>
                            <li>
                                <span>disable tumblr live</span>
                                <input class="configInput" type="checkbox" id="__c7" name="6" ${configPreferences[6].value}>
                            </li>
                            <li>
                                <span>disable tumblr domains</span>
                                <input class="configInput" type="checkbox" id="__c8" name="7" ${configPreferences[7].value}>
                            </li>
                            <li>
                                <span>revert activity feed redesign</span>
                                <input class="configInput" type="checkbox" id="__c9" name="8" ${configPreferences[8].value}>
                            </li>
                            <li>
                                <span>revert messaging redesign</span>
                                <input class="configInput" type="checkbox" id="__c10" name="9" ${configPreferences[9].value}>
                            </li>
                            <li>
                                <span>allow legacy post editor</span>
                                <input class="configInput" type="checkbox" id="__c11" name="10" ${configPreferences[10].value}>
                            </li>
                            <li>
                                <span>enable customizable dashboard tabs</span>
                                <input class="configInput" type="checkbox" id="__c12" name="11" ${configPreferences[11].value}>
                            </li>
                            <li>
                                <span>enable adding polls to reblogs</span>
                                <input class="configInput" type="checkbox" id="__c13" name="12" ${configPreferences[12].value}>
                            </li>
                        </ul>
                    </div>
                </div>
            `)
            $("html").append($menu);
            if (!storageAvailable("localStorage") || type === "b") {
                $("#__cta").hide();
            }
            $("#__cb").on("click", () => {
                if ($("#__c").is(":hidden")) {
                    $("#__cb svg").css("--icon-color-primary", "rgb(var(--white-on-dark))");
                } else { $("#__cb svg").css("--icon-color-primary", "rgba(var(--white-on-dark),.65)") }
                $("#__c").toggle();
            });
            $("#__ab").on("click", () => {
                if ($("#__a").is(":hidden")) {
                    $("#__ab svg").css("--icon-color-primary", "rgb(var(--white-on-dark))");
                } else { $("#__ab svg").css("--icon-color-primary", "rgba(var(--white-on-dark),.65)") }
                $("#__a").toggle();
            });
            $(".configInput").on("change", function () {
                configPreferences[Number($(this).attr("name"))].value = $(this).is(":checked") ? "checked" : "";
                checkboxEvent($(this).attr("id"), $(this).is(":checked"));
                updatePreferences(configPreferences);
            });
            $(keyToCss("timelineHeader")).toggle(!$("#__c1").is(":checked"));
            $(keyToCss("menuContainer")).has('use[href="#managed-icon__explore"]').toggle(!$("#__c4").is(":checked"));
            $(keyToCss("menuContainer")).has('use[href="#managed-icon__shop"]').toggle(!$("#__c5").is(":checked"));
            if (match.includes(location.pathname.split("/")[1])) {
                waitFor(keyToCss("sidebar")).then(() => {
                    $(keyToCss("sidebar")).prepend($menu);
                    waitFor(keyToCss("sidebarItem")).then(() => {
                        $(keyToCss("sidebarItem")).has(keyToCss("recommendedBlogs")).toggle(!$("#__c2").is(":checked"));
                        $(keyToCss("sidebarItem")).has(keyToCss("radar")).toggle(!$("#__c3").is(":checked"));
                    });
                });
            }
            if ($("#__c7").is(":checked")) {
                waitFor(keyToCss("liveMarquee")).then(() => {
                    $(keyToCss("menuContainer")).has('use[href="#managed-icon__live-video"]')
                        .add($(keyToCss("navItem")).has('use[href="#managed-icon__coins"]'))
                        .add($(keyToCss("listTimelineObject")).has($(keyToCss("liveMarquee")))).hide();
                });
            }
            console.log("dashboard fixed!");
        }

        requestAnimationFrame(() => {
            $unfuck().catch((e) => {
                window.setTimeout($unfuck, 400)
            });
        });

        window.tumblr.on('navigation', () => requestAnimationFrame(() => {
            $unfuck().catch((e) => {
                window.setTimeout($unfuck, 400)
            });
        }));
    });

    async function getUtilities() {
        let retries = 0;
        while (retries++ < 1000 && (typeof tumblr === "undefined" || typeof tumblr.getCssMap === "undefined")) {
            await new Promise((resolve) => setTimeout(resolve));
        }
        const cssMap = await tumblr.getCssMap();
        const keyToClasses = (...keys) => keys.flatMap(key => cssMap[key]).filter(Boolean);
        const keyToCss = (...keys) => `:is(${keyToClasses(...keys).map(className => `.${className}`).join(", ")})`;
        return { keyToCss };
    }
});