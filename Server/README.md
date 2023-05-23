# `film library`

## APIs
Hereafter, we report the designed HTTP APIs, also implemented in the project.

### __List Films__

URL: `/api/films`

Method: GET

Description: Get all the films.

Request body: _None_

Response: `200 OK` (success) or `500 Internal Server Error` (generic error).

Response body: An array of objects, each describing a film.
```
    [{
        "id":1,
        "title":"Pulp Fiction",
        "favorites":true,
        "date":"2023-03-09T23:00:00.000Z",
        "rating":5
    },
    ...
]
```

### __Get a Film (by Id)__

URL: `/api/films/<id>`

Method: GET

Description: Get the film identified by the id `<id>`.

Request body: _None_

Response: `200 OK` (success), `404 Not Found` (wrong id), or `500 Internal Server Error` (generic error).

Response body: An object, describing a single question.
```
{
    "id":1,
    "title":"Pulp Fiction",
    "favorites":true,
    "date":"2023-03-09T23:00:00.000Z",
    "rating":5
}
```

### __List Films watched After date__

URL: `/api/films/after/<date>`

Method: GET

Description: Get all the films watched after date parameter (format YYYY-MM-DD).

Request body: _None_

Response: `200 OK` (success) or `500 Internal Server Error` (generic error).

Response body: An array of objects, each describing a film.
```
    [{
        "id":1,
        "title":"Pulp Fiction",
        "favorites":true,
        "date":"2023-03-09T23:00:00.000Z",
        "rating":5
    },
    ...
]
```

### __List Films with rating equals to rate__

URL: `/api/films/rating/<rate>`

Method: GET

Description: Get all the films with rating == rate.

Request body: _None_

Response: `200 OK` (success) or `500 Internal Server Error` (generic error).

Response body: An array of objects, each describing a film.
```
    [{
        "id":1,
        "title":"Pulp Fiction",
        "favorites":true,
        "date":"2023-03-09T23:00:00.000Z",
        "rating":5
    },
    ...
]
```


