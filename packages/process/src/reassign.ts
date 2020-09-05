import * as express from 'express';
import { getProcessInstanceWorkitem, processInstanceWorkitemReassign } from './process_manager'
import * as core from "express-serve-static-core";

interface Request extends core.Request {
    user: any;
}

export const reassign = async (req: Request, res: express.Response) => {

    try {
        const urlParams = req.params;
        // const objectName = urlParams.objectName;
        const instanceHistoryId = urlParams.record;
        const userSession = req.user;
        const body = req.body;
        const comment = body.comment;
        const approver = body.approver;

        const workitem = await getProcessInstanceWorkitem(instanceHistoryId, userSession);

        await processInstanceWorkitemReassign(workitem._id, userSession, comment, approver);

        return res.status(200).send({state: 'SUCCESS'});
    } catch (error) {
        console.log(error);
        return res.status(200).send({state: 'FAILURE', error: error.message});
    }
}