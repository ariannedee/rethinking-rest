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
        issues {
          totalCount
        }
        PRs: pullRequests {
          totalCount
        }
        ... commitFragment
      }
    }
  }
}
` + commitFragment;

let mutationAddStar;

let mutationRemoveStar;

function gqlRequest(query, variables, onSuccess) {
  // MAKE GRAPHQL REQUEST
  $.post({
    url: "https://api.github.com/graphql",
    contentType: "application/json",
    headers: {
      Authorization: `bearer ${env.GITHUB_PERSONAL_ACCESS_TOKEN}`
    },
    data: JSON.stringify({
      query: query,
      variables: variables
    }),
    success: (response) => {
      console.log(response);
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
    $("header h2").text(`Hello ${data.viewer.name}`);
    const repos = data.viewer.repositories;
    if (repos.totalCount > 0) {
      $("ul.repos").empty();
      repos.nodes.forEach((repo) => {
        let commits;
        if (repo.ref) {
          commits = `<p>${repo.ref.target.history.totalCount} PRs</p>`;
        } else {
          commits = '';
        }
        const card = `
        <h3>${repo.name}</h3>
        <p>${repo.issues.totalCount} issues</p>
        <p>${repo.PRs.totalCount} PRs</p>
        ${commits} 
        `;
        $("ul.repos").append(`<li>${card}</li>`);
      });
    }
  });
});