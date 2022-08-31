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

const queryRepoList = `
query ($username: String!) { 
  user (login: $username) { 
    name
    repositories (
      first: 12,
      orderBy: {field: CREATED_AT, direction: DESC}
    ) {
      totalCount
      nodes {
        name
        openIssues: issues (states: OPEN) {
          totalCount
        }
        openPRs: pullRequests (states: OPEN) {
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
    url: 'https://api.github.com/graphql',
    ContentType: 'application/json',
    headers: {Authorization: `bearer ${env.GITHUB_PERSONAL_ACCESS_TOKEN}`},
    data: JSON.stringify({
      query: query,
      variables: variables
    }),
    success: (response) => {
      if (response.errors) {
        console.log(response.errors);
      } else {
        onSuccess(response.data);
        console.log(response.data);
      }
    },
    error: (error) => {
      console.log(error);
    }
  })
}

function starHandler(element) {
  // STAR OR UNSTAR REPO BASED ON ELEMENT STATE

}

$(window).ready(function() {
  // GET NAME AND REPOSITORIES FOR VIEWER
  gqlRequest(queryRepoList, {username: 'ariannedee'}, (data) => {
    $('h2').text(`Hello ${data.user.name}!`);
    const repos = data.user.repositories;
    if (repos.totalCount > 0) {
      $('ul.repos').empty();
    }
    repos.nodes.forEach((repo) => {
      const card = `<li>
      <h3>${repo.name}</h3>
      <p>${repo.openIssues.totalCount} open issues</p>
      <p>${repo.openPRs.totalCount} open PRs</p>
      </li>`;
      $('ul.repos').append(card);
    })
  });
});
