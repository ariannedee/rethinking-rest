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
    repos: repositoriesContributedTo (first: 6) {
      nodes {
        name: nameWithOwner
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
      console.log(response);
      if (response.errors !== undefined) {
        console.log("There were errors");
        console.log(response.errors);
      } else {
        onSuccess(response.data);
      }
    },
    error: (response) => {
      console.log(response);
    }
  });
}

function starHandler(element) {
  // STAR OR UNSTAR REPO BASED ON ELEMENT STATE

}

$(window).ready(function() {
  // GET NAME AND REPOSITORIES FOR VIEWER
  gqlRequest(queryRepoList, {}, (data) => {
    $("header h2").text(`Hello ${data.viewer.name}`);
    $("ul.repos").empty();
    data.viewer.repos.nodes.forEach((repo) => {
      const cardContent = `<h3>${repo.name}</h3>`;
      $("ul.repos").append(`<li><div>${cardContent}</div></li>`);
    });

  });
});