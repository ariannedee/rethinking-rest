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

let queryRepoList;

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
  gqlRequest("{viewer{names}}", {}, (data) => {
    $('h2').text(`Hello ${data.viewer.name}!`);
  });
});
