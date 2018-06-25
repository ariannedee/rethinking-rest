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
query($login: String!){
  user(login: $login) {
    name
    repositories: repositoriesContributedTo(first: 10, orderBy: {field: CREATED_AT, direction: DESC}) {
      nodes {
        name
		    id
		    issues (states: OPEN) {
			    totalCount
		    }
		    pullRequests (states: OPEN) {
			    totalCount
        }
        ... commitFragment
        starred: viewerHasStarred
      }
    }
  }
}
` + commitFragment;

const mutationAddStar = `
mutation ($id: ID!){
  addStar(input: {starrableId: $id}) {
    starrable {
      ... on Repository {
        name
        starred: viewerHasStarred
      }
    }
  }
}
`;

const mutationRemoveStar = `
mutation ($id: ID!){
  removeStar(input: {starrableId: $id}) {
    starrable {
      ... on Repository {
        name
        starred: viewerHasStarred
      }
    }
  }
}
`;

function gqlRequest(query, variables, onSuccess) {
  $.post({
    url: "https://api.github.com/graphql",
    contentType: "application/json",
    headers: {
      Authorization: "bearer f751b9e7084e37ea7a2e6eea6b9fa2baf310c5ca"
    },
    data: JSON.stringify({query: query, variables: variables}),
    success: onSuccess,
    error: (error) => console.log(error)
  });
}

function starHandler(element) {
  if ($(element).text()===emptyStar){
    gqlRequest(
      mutationAddStar, 
      {id: element.id}, 
      () => $(element).text(fullStar)
    );
  } else {
    gqlRequest(
      mutationRemoveStar, 
      {id: element.id}, 
      () => $(element).text(emptyStar)
    );
  }
};

$(window).ready(function() {
  gqlRequest(
    queryRepoList, 
    {login: "ariannedee"},
    (response) => {
      const user = response.data.user;
      $("header h2").text(`Hello ${user.name}!`);
      $("ul.repos").empty();
      user.repositories.nodes.forEach((repo) => {
        let commits = 0;
        if (repo.ref) {
          commits = repo.ref.target.history.totalCount;
        }
        let star;
        if (repo.starred) {
          star = fullStar;
        } else {
          star = emptyStar;
        }
        const content = `<h4>
          ${repo.name}
          <span class="star" id="${repo.id}" onClick="starHandler(this)">${star}</span>
          </h4>
          <p>${repo.issues.totalCount} issues</p>
          <p>${repo.pullRequests.totalCount} pull requests</p>
          <p>${commits} commits</p>
        `;
        $("ul.repos").append(`<li><div>${content}</div></li>`);
      });
    }
  );
});