# Abstract

(en)
This document is a table blueprint for the HackDay project.

(jp)
このドキュメントはHackDayプロジェクトのテーブル設計図です。

## Master Tables

### Organisation

|column name         |type      |constraints              |
|--------------------|----------|-------------------------|
|id(PK)              |uuid      |default uuid_generate_v4 |
|name                |strings   |not null                 |
|detail              |strings   |not null                 |
|icon_url            |strings   |                         |
|created_at          |timestamp |default current_timestamp|
|updated_at          |timestamp |default current_timestamp|

### Profiles

|column name         |type      |constraints              |
|--------------------|----------|-------------------------|
|id(PK)              |uuid      |default uuid_generate_v4 |
|name                |strings   |not null                 |
|self_introduction   |text      |not null                 |
|icon_url            |strings   |                         |
|twitter_url         |strings   |                         |
|facebook_url        |strings   |                         |
|created_at          |timestamp |default current_timestamp|
|updated_at          |timestamp |default current_timestamp|

### Users

|column name         |type      |constraints              |
|--------------------|----------|-------------------------|
|user_id(FK)         |uuid      |not null                 |
|login_user_name(PK) |strings   |unique                   |

### Projects

|column name         |type      |constraints              |
|--------------------|----------|-------------------------|
|id(PK)              |uuid      |default uuid_generate_v4 |
|owner_user_id(FK)   |uuid      |not null                 |
|name                |strings   |not null                 |
|purpose             |strings   |                         |
|what_to_do          |strings   |                         |
|problem             |strings   |                         |
|targets             |strings   |                         |
|needed_help         |strings   |                         |
|project_url         |strings   |                         |
|how_to_join         |strings   |                         |
|created_at          |timestamp |default current_timestamp|
|updated_at          |timestamp |default current_timestamp|

### Tags

|column name         |type      |constraints              |
|--------------------|----------|-------------------------|
|id(PK)              |uuid      |default uuid_generate_v4 |
|name                |strings   |not null                 |

### Events

|column name         |type      |constraints              |
|--------------------|----------|-------------------------|
|id(PK)              |uuid      |default uuid_generate_v4 |
|name                |strings   |not null                 |
|detail              |text      |                         |
|how_to_join         |strings   |                         |
|start_datetime      |datetime  |                         |
|end_datetime        |datetime  |                         |
|event_image_url     |strings   |                         |

### Activities

|column name         |type      |constraints              |
|--------------------|----------|-------------------------|
|id(PK)              |uuid      |default uuid_generate_v4 |
|user_id(FK)         |uuid      |not null                 |
|project_id(FK)      |uuid      |not null                 |
|headline            |strings   |not null                 |
|detail              |text      |not null                 |
|post_time           |datetime  |default current_timestamp|

## Join Tables

### Joined_projects

|column name         |type      |constraints              |
|--------------------|----------|-------------------------|
|id(PK)              |uuid      |default uuid_generate_v4 |
|user_id(FK)         |uuid      |not null                 |
|project_id(FK)      |uuid      |not null                 |

### Support_projects

|column name         |type      |constraints              |
|--------------------|----------|-------------------------|
|id(PK)              |uuid      |default uuid_generate_v4 |
|user_id(FK)         |uuid      |not null                 |
|project_id(FK)      |uuid      |not null                 |

### Joined_organisations

|column name         |type      |constraints              |
|--------------------|----------|-------------------------|
|id(PK)              |uuid      |default uuid_generate_v4 |
|user_id(FK)         |uuid      |not null                 |
|organisation_id(FK) |uuid      |not null                 |

### Star_projects

|column name         |type      |constraints              |
|--------------------|----------|-------------------------|
|id(PK)              |uuid      |default uuid_generate_v4 |
|user_id(FK)         |uuid      |not null                 |
|project_id(FK)      |uuid      |not null                 |

### Tagged_projects

|column name         |type      |constraints              |
|--------------------|----------|-------------------------|
|id(PK)              |uuid      |default uuid_generate_v4 |
|project_id(FK)      |uuid      |not null                 |
|tag_id(FK)          |uuid      |not null                 |

### Resistered_projects_for_the_event

|column name         |type      |constraints              |
|--------------------|----------|-------------------------|
|id(PK)              |uuid      |default uuid_generate_v4 |
|event_id(FK)        |uuid      |not null                 |
|project_id(FK)      |uuid      |not null                 |