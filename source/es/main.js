import jobs_json from './../../data/json/es/jobs.json' assert { type: 'json' }
import studies_json from './../../data/json/es/studies.json' assert { type: 'json' }
import courses_json from './../../data/json/es/courses.json' assert { type: 'json' }
import projects_json from './../../data/json/es/projects.json' assert { type: 'json' }

import { prepare_json, prepare_programming_charts } from './../functions.js'

prepare_json(jobs_json, studies_json, courses_json, projects_json, 'es');
prepare_programming_charts();