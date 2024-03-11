import express from 'express'
import serverResponses from '../utils/helpers/responses'
import messages from '../config/messages'
import { evaluateApiPerformance } from '../utils/helpers/graphqlRouteHelper';
import { Request, Response } from 'express';

const routes = (app) => {
  const router = express.Router();

  router.post("/graphql", async (req : Request, res : Response) => {
    try {
      const { graphqlQuery, virtualUsers } = req.body;

      const result = await evaluateApiPerformance(virtualUsers , graphqlQuery);
      serverResponses.sendSuccess(res, messages.SUCCESSFUL, result);
    } catch (error : any) {
      serverResponses.sendError(res, messages.BAD_REQUEST);
    };
  });

  app.use("/api", router);
};

export default routes;
