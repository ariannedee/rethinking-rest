const fullStar = "★";
const emptyStar = "☆";

const commitFragment = `
fragment commitFragment on Repository {
  ref(qualifiedName: "master") {
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

const queryRepoList = `
{
  viewer {
    name
    repositories(first: 12, orderBy: {field: CREATED_AT, direction: DESC}) {
      totalCount
      nodes {
        name
        openIssues: issues {
          totalCount
        }
        openPRs: pullRequests {
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
  // MAKE GRAPHQL REQUEST
  $.post({
    url: "https://api.github.com/graphql",
    ContentType: "application/json",
    headers: {Authorization: `bearer ${env.GITHUB_PERSONAL_ACCESS_TOKEN}`},
    data: JSON.stringify({query: query, variables: variables}),
    success: (response) => {
      if (response.errors) {
        console.log(response.errors);
      } else {
        onSuccess(response.data);
      }
    }
  })
}

function starHandler(element) {
  // STAR OR UNSTAR REPO BASED ON ELEMENT STATE

}

$(window).ready(function() {
  // GET NAME AND REPOSITORIES FOR VIEWER
  gqlRequest(queryRepoList, {}, (data) => {
    console.log(data);
    $('header h2').text(`Hello ${data.viewer.name}`);
    const repos = data.viewer.repositories;
    if (repos.totalCount > 0){
      $('ul.repos').empty();
    }
    repos.nodes.forEach((repo) => {
      let numCommits = 0;
      if (repo.ref) {
        numCommits = repo.ref.target.history.totalCount;
      }
      const li = `
      <li>
        <h3>${repo.name}</h3>
        <p>${repo.openIssues.totalCount} open issues</p>
        <p>${repo.openPRs.totalCount} open PRs</p>
        <p>${numCommits} commits</p>
      </li>`;
      $('ul.repos').append(li);
    });
  });
});