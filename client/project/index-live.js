const fullStar = "★";
const emptyStar = "☆";

const commitFragment = `
fragment commitFragment on Repository {
  master: ref(qualifiedName: "master") {
    target {
      ... on Commit {
        history {
          totalCount
        }
      }
    }
  }
  main: ref(qualifiedName: "main") {
    target {
      ... on Commit {
        history {
          totalCount
        }
      }
    }
  }
}
`;

const queryRepoList = `{
  viewer: user(login: "ariannedee") {
    name
    repositories(first: 12, orderBy: {field: CREATED_AT, direction: DESC}) {
      totalCount
      nodes {
        id
        name
        openIssues: issues(states: OPEN) {
          totalCount
        }
        openPRs: pullRequests(states: OPEN) {
          totalCount
        }
        ... commitFragment
      }
    }
  }
}` + commitFragment;

let mutationAddStar;

let mutationRemoveStar;

function gqlRequest(query, variables, onSuccess) {
  $.post({
    url: "https://api.github.com/graphql",
    contentType: "application/json",
    headers: {Authorization: `bearer ${env.GITHUB_PERSONAL_ACCESS_TOKEN}`},
    data: JSON.stringify({
      query: query,
      variables: variables
    }),
    error: (error) => {
      console.log(error);
    },
    success: (response) => {
      console.log(response.data);
      onSuccess(response.data);
    }
  });
}

function starHandler(element) {
  // STAR OR UNSTAR REPO BASED ON ELEMENT STATE

}

$(window).ready(function() {
  gqlRequest(queryRepoList, null, (data) => {
    $("header h2").text(`Hello ${data.viewer.name}`);
    const repos = data.viewer.repositories;
    if (repos.totalCount > 0) {
      $("ul.repos").empty();
      repos.nodes.forEach((repo) => {
        let numCommits = 0;
        if (repo.main) {
          numCommits = repo.main.target.history.totalCount;
        } else if (repo.master) {
          numCommits = repo.master.target.history.totalCount;
        }
        const card = `<li>
        <h3>${repo.name}</h3>
        <p>${repo.openIssues.totalCount} open issues</p>
        <p>${repo.openPRs.totalCount} open PRs</p>
        <p>${numCommits} commits</p>
        </li>`;
        $("ul.repos").append(card);
      });
    }
  });
});
