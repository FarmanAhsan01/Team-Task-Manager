# Phase 2 Implementation Guide - Ready to Build

## 🎯 What We're Building Now

Complete REST API for Teams, Projects, and Tasks with:
- Full CRUD operations
- Permission-based access
- Real-time ready infrastructure
- AI-powered prioritization
- Advanced filtering & pagination

## 📋 Phase 2 - Team Management (Session 1)

### What Gets Built

```
TEAMS API
├── POST   /api/v1/teams                    - Create team
├── GET    /api/v1/teams                    - List user's teams
├── GET    /api/v1/teams/:id                - Get team details
├── PUT    /api/v1/teams/:id                - Update team
├── DELETE /api/v1/teams/:id                - Delete team
├── POST   /api/v1/teams/:id/members        - Invite member
├── GET    /api/v1/teams/:id/members        - List members
├── PUT    /api/v1/teams/:id/members/:uid   - Update member role
└── DELETE /api/v1/teams/:id/members/:uid   - Remove member
```

### Files to Create

1. **services/team.service.js** - Business logic
2. **controllers/team.controller.js** - HTTP handlers
3. **routes/team.routes.js** - Express routes
4. **validations/team.validation.js** - Joi schemas

### Implementation Pattern (Copy From Auth)

```javascript
// team.service.js
export class TeamService {
  async createTeam(userId, data) {
    // 1. Validate input (schema handles this)
    // 2. Create team in database
    // 3. Add creator as admin member
    // 4. Return created team
  }

  async getTeamMembers(teamId) {
    // 1. Verify team exists
    // 2. Fetch all members with roles
    // 3. Return members
  }

  async inviteMember(teamId, memberId, role) {
    // 1. Check if user already member
    // 2. Add member with role
    // 3. Return updated team
  }
  // ... more methods
}
```

```javascript
// team.controller.js
export const createTeam = asyncHandler(async (req, res) => {
  const { name, description } = req.validatedData;
  const userId = req.user.id;
  
  const team = await teamService.createTeam(userId, {
    name,
    description,
  });
  
  res.status(201).json(formatResponse("Team created successfully", team));
});
```

```javascript
// team.routes.js
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { rbacMiddleware } from "../middlewares/rbac.middleware.js";
import { validationMiddleware } from "../middlewares/validation.middleware.js";
import { teamSchemas } from "../validations/index.js";

const router = express.Router();

router.use(authMiddleware); // All routes require auth

router.post(
  "/",
  validationMiddleware(teamSchemas.createTeam),
  createTeam
);

router.get("/:id/members", getTeamMembers);

// ... more routes
```

## 📋 Phase 2 - Projects (Session 2)

### What Gets Built

```
PROJECTS API
├── POST   /api/v1/projects                 - Create project
├── GET    /api/v1/projects                 - List projects
├── GET    /api/v1/projects/:id             - Get project details
├── PUT    /api/v1/projects/:id             - Update project
├── DELETE /api/v1/projects/:id             - Delete project
├── GET    /api/v1/projects/:id/tasks       - Get project tasks (with prioritization!)
├── POST   /api/v1/projects/:id/archive     - Archive project
└── GET    /api/v1/projects/:id/stats       - Get project statistics
```

### Key Features

- Projects belong to Teams
- Status tracking (Active, On Hold, Completed, Archived)
- Deadline management
- Budget tracking (optional)
- Integrated task prioritization

### Files to Create

1. **services/project.service.js**
2. **controllers/project.controller.js**
3. **routes/project.routes.js**
4. **validations/project.validation.js**

## 📋 Phase 2 - Tasks (Session 3)

### What Gets Built

```
TASKS API
├── POST   /api/v1/tasks                    - Create task
├── GET    /api/v1/tasks                    - List tasks (filtered, paginated, sorted by priority!)
├── GET    /api/v1/tasks/:id                - Get task details
├── PUT    /api/v1/tasks/:id                - Update task
├── DELETE /api/v1/tasks/:id                - Delete task
├── PATCH  /api/v1/tasks/:id/status         - Change status
├── POST   /api/v1/tasks/:id/assign         - Assign task
├── GET    /api/v1/tasks/:id/dependencies   - Get blocking tasks
├── POST   /api/v1/tasks/:id/dependencies   - Add dependency
└── GET    /api/v1/tasks/priority-metrics   - Get AI priority analysis
```

### Special Features

- **Smart Prioritization** - Uses task-prioritization.service.js
- **Dependencies** - Blocking & blocked tasks
- **Status Tracking** - TODO → IN_PROGRESS → IN_REVIEW → TESTING → COMPLETED
- **Workload Balancing** - Check assignee's capacity before assigning
- **Time Tracking** - Estimated vs actual hours
- **Comments** - Task discussion thread

### Files to Create

1. **services/task.service.js**
2. **controllers/task.controller.js**
3. **routes/task.routes.js**
4. **validations/task.validation.js**

## 🔄 Complete Phase 2 Implementation Pattern

### Step 1: Create Validation Schema

```javascript
// validations/index.js
export const teamSchemas = {
  createTeam: Joi.object({
    name: Joi.string().required().min(3).max(100),
    description: Joi.string().optional().max(500),
  }),
  
  inviteMember: Joi.object({
    memberId: Joi.string().uuid().required(),
    role: Joi.string().valid("ADMIN", "MEMBER", "VIEWER").required(),
  }),
};
```

### Step 2: Create Service Layer

```javascript
// services/team.service.js
export class TeamService {
  async createTeam(userId, data) {
    try {
      const team = await prisma.team.create({
        data: {
          name: data.name,
          description: data.description,
          createdBy: userId,
          teamMembers: {
            create: {
              userId: userId,
              role: "ADMIN",
            },
          },
        },
        include: { teamMembers: true },
      });
      
      logger.info(`Team created: ${team.id}`);
      return team;
    } catch (error) {
      if (error.code === "P2002") {
        throw new ConflictError("Team name already exists");
      }
      throw error;
    }
  }
  
  // ... more methods
}
```

### Step 3: Create Controller

```javascript
// controllers/team.controller.js
export const createTeam = asyncHandler(async (req, res) => {
  const { name, description } = req.validatedData;
  const userId = req.user.id;
  
  const team = await teamService.createTeam(userId, {
    name,
    description,
  });
  
  res.status(201).json(
    formatResponse("Team created successfully", team)
  );
});
```

### Step 4: Create Routes

```javascript
// routes/team.routes.js
import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import * as teamController from "../controllers/team.controller.js";
import { validationMiddleware } from "../middlewares/validation.middleware.js";
import { teamSchemas } from "../validations/index.js";

const router = express.Router();

router.use(authMiddleware);

router.post(
  "/",
  validationMiddleware(teamSchemas.createTeam),
  teamController.createTeam
);

router.get("/:id", teamController.getTeam);

// ... more routes

export default router;
```

### Step 5: Add Routes to App

```javascript
// app.js - add after auth routes
import teamRoutes from "./routes/team.routes.js";
app.use("/api/v1/teams", teamRoutes);
```

## 📊 Phase 2 Timeline

| Task | Effort | Est. Time |
|------|--------|-----------|
| Team Service + Controller + Routes | ⭐⭐ | 45 min |
| Team Validation & Error Handling | ⭐ | 15 min |
| Project Service (similar pattern) | ⭐⭐ | 45 min |
| Task Service (complex, with prioritization) | ⭐⭐⭐ | 90 min |
| Testing all endpoints | ⭐ | 30 min |
| **Total Phase 2** | - | **~4 hours** |

## 🎯 Success Criteria Phase 2

- ✅ Teams can be created, updated, deleted
- ✅ Team members can be invited and assigned roles
- ✅ Projects can be created and linked to teams
- ✅ Tasks can be created and assigned to projects
- ✅ Tasks are auto-prioritized using AI algorithm
- ✅ Tasks show correct priority scores (0-100)
- ✅ All endpoints protected by auth + RBAC
- ✅ Proper error handling with custom errors
- ✅ All responses formatted consistently
- ✅ Comprehensive logging

## 🧪 Testing Phase 2 (Postman Collection Example)

```bash
# 1. Create Team
POST http://localhost:5000/api/v1/teams
Authorization: Bearer {accessToken}
{
  "name": "Development Team",
  "description": "Backend developers"
}
Response: { id, name, teamMembers: [] }

# 2. Get Teams
GET http://localhost:5000/api/v1/teams
Authorization: Bearer {accessToken}
Response: [{ id, name, ... }]

# 3. Create Project
POST http://localhost:5000/api/v1/projects
Authorization: Bearer {accessToken}
{
  "name": "TaskForge MVP",
  "description": "Build MVP features",
  "teamId": {teamId},
  "deadline": "2024-03-31"
}
Response: { id, name, teamId, ... }

# 4. Create Task (with priority!)
POST http://localhost:5000/api/v1/tasks
Authorization: Bearer {accessToken}
{
  "title": "Setup database",
  "projectId": {projectId},
  "estimatedHours": 8,
  "dueDate": "2024-03-20",
  "priority": "HIGH"
}
Response: { id, title, priorityScore: 85, ... }

# 5. Get Tasks by Priority
GET http://localhost:5000/api/v1/tasks?projectId={projectId}&sortBy=priorityScore
Authorization: Bearer {accessToken}
Response: [
  { id, title, priorityScore: 92, status: "TODO" },
  { id, title, priorityScore: 78, status: "TODO" },
  { id, title, priorityScore: 65, status: "IN_PROGRESS" }
]
```

## 🚀 Key Implementation Notes

1. **Reuse Patterns** - Copy auth pattern for teams/projects/tasks
2. **Permission Checks** - Use rbacMiddleware to ensure access
3. **Task Prioritization** - Use taskPrioritizationService.calculatePriorityScore()
4. **Error Handling** - Throw appropriate custom errors (throw new ForbiddenError())
5. **Logging** - Log all important operations (logger.info())
6. **Validation** - Let middleware handle validation errors
7. **Transactions** - Use prisma.$transaction for multi-step operations

## 📝 Copy-Paste Template

### Service Method Template
```javascript
async methodName(param1, param2) {
  try {
    // 1. Validate/check conditions
    const existing = await prisma.model.findUnique({ where: { id: param1 } });
    if (!existing) throw new NotFoundError("Resource not found");
    
    // 2. Perform operation
    const result = await prisma.model.update({
      where: { id: param1 },
      data: { field: param2 },
    });
    
    // 3. Log
    logger.info(`Operation completed: ${param1}`);
    
    // 4. Return
    return result;
  } catch (error) {
    logger.error("Operation failed:", error);
    throw error;
  }
}
```

### Controller Method Template
```javascript
export const methodName = asyncHandler(async (req, res) => {
  // 1. Extract data
  const { field1, field2 } = req.validatedData;
  const userId = req.user.id;
  
  // 2. Call service
  const result = await serviceInstance.methodName(field1, field2);
  
  // 3. Return response
  res.status(200).json(
    formatResponse("Success message", result)
  );
});
```

## 🎓 Learning Outcomes

By implementing Phase 2, you'll master:

✅ REST API design (CRUD + advanced operations)
✅ Permission-based access control (RBAC)
✅ Relational database queries
✅ Service layer design
✅ Error handling patterns
✅ Request validation
✅ API response formatting
✅ Task prioritization algorithms
✅ Production code patterns

---

## Ready? Let's Go!

When ready to start Phase 2, run:
```bash
npm run dev
```

Then request: "Start Phase 2 - Build Team Management API"

You'll have:
- ✅ Teams created/managed
- ✅ Project structure
- ✅ Task prioritization working
- ✅ Professional API endpoints
- ✅ Production-ready backend

Expected time: **4-6 hours for complete implementation**

Result: **Fully functional project management platform ready for Phase 3 (Real-time + Analytics)**

---

*Phase 2 Ready to Start*
*Architecture: Established*
*Patterns: Proven*
*Next: Scale to features*
