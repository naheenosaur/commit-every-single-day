const fetch = require('node-fetch');
const core = require('@actions/core');

const username = core.getInput('username');
const repository = core.getInput('repository');
let url = 'https://api.github.com/users/' + username + '/events';

const result = {
    graph: "http://ghchart.rshah.org/" + username,
    repo: {
        name: '', url: ''
    },
    commit: {
        author: {
            email: '', name: '', date: ''
        },
        message: '',
        url: ''
    }
};

function getLastEvent() {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(res => res.json())
            .then(res => {
                const pushEvent = res.filter(data => data.type === "PushEvent");
                while (pushEvent !== null && pushEvent.length !== 0) {
                    let event = pushEvent.shift();
                    if (event.repo.name === repository) {
                        continue;
                    }
                    result['repo'] = event.repo;
                    result['commit'] = event.payload.commits.pop();
                    resolve(result);
                    break;
                }
                reject("no last event");
            });
    });
}

function getLastCommit() {
    return new Promise((resolve, reject) => {
        fetch(result.commit.url)
            .then(res => res.json())
            .then(res => {
                result.commit.author.date = new Date(res.commit.author.date);
                resolve(result);
                reject("no last commit");
            });
    });
}


function createHtml() {
    let html = "<!DOCTYPE html>\n" +
        "<html lang=\"en\">\n" +
        "<head>\n" +
        "    <meta charset=\"UTF-8\">\n" +
        "    <title>Title</title>\n" +
        "</head>\n" +
        "<body>\n" +
        "<img src=" + result.graph + ">\n" +
        "<table>\n" +
        "    <tr>\n" +
        "        <td>last commit repository : </td>\n" +
        "        <td>" + result.repo.name + "</td>\n" +
        "    </tr>\n" +
        "    <tr>\n" +
        "        <td>last commit message : </td>\n" +
        "        <td>" + result.commit.message + "</td>\n" +
        "    </tr>\n" +
        "    <tr>\n" +
        "        <td>last commit date : </td>\n" +
        "        <td>" + result.commit.author.date + "</td>\n" +
        "    </tr>\n" +
        "</table>\n" +
        "</body>\n" +
        "</html>";
    return html;
}


function committedToday(date) {
    return new Promise((resolve) => {
        let lastCommitDate = new Date(date).toLocaleDateString();
        let today = new Date().toLocaleDateString();
        resolve(lastCommitDate === today);
    })
}

getLastEvent()
    .then(getLastCommit)
    .then(createHtml)
    .then(html => {
        core.setOutput("last-commit-info", JSON.stringify(result));
        core.setOutput("github-page", html);
        committedToday(result.commit.author.date)
            .then(is => core.setOutput("committed", is.toString()));
    })
    .catch(error => {
        console.log(error);
        core.setOutput("committed", "false");
    });

