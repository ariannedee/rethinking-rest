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
    repositories (first: 6){
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
      Authorization: "bearer ..."
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
      }
    },
    error: (error) => console.log(error)
  });
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
    if (repos.totalCount > 0) {
      $('ul.repos').empty();
      repos.nodes.forEach((repo) => {
        console.log(repo);
        $('ul.repos').append(`<li><h3>${repo.name}</h3></li>`);
      });
    }
  });
});