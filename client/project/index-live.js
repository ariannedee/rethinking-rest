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
query { 
  viewer { 
    name
    repositories(first: 100) {
      totalCount
      nodes {
        name
      }
    }
  }
}
`;

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
      if (response.errors) {
        console.log(response.errors);
      } else {
        onSuccess(response.data);
        console.log(response.data);
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
    let repos = data.viewer.repositories;
    if (repos.totalCount > 0) {
      $("ul.repos").empty();
      repos.nodes.forEach((repo) => {
        let card = `
        <li>
          <h3>${repo.name}</h3>
        </li>
        `;
        $("ul.repos").append(card);
      });
    }
  });
});