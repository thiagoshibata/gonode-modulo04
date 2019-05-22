"use strict";

const Project = use("App/Models/Project");

class ProjectController {
  async index({ request }) {
    const { page } = request.get();
    const project = await Project.query()
      .with("user")
      .paginate(page);

    return project;
  }

  async store({ request, response, auth }) {
    const data = request.only(["title", "description"]);

    const project = await Project.create({ ...data, user_id: auth.user.id });

    return project;
  }

  async show({ params }) {
    const project = await Project.findOrFail(params.id);

    await project.load("user");
    await project.load("tasks");

    return project;
  }

  async update({ params, request }) {
    const project = await Project.findOrFail(params.id);
    const data = request.only(["title", "description"]);

    project.merge(data);

    await project.save();

    return project;
  }

  async destroy({ params }) {
    const project = await Project.findOrFail(params.id);

    project.delete();
  }
}

module.exports = ProjectController;
