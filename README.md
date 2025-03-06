![badge-labs](https://user-images.githubusercontent.com/327285/230928932-7c75f8ed-e57b-41db-9fb7-a292a13a1e58.svg)

# FINOS DTCC Hackathon

## Project Name

Info-Navigator for Capital Markets

### Project Details

The solution facilitates the identification and extraction of unstructured data in a variety of modalities and formats. It enables dynamic research suited to capital market demands, shortens cycle time, and improves decision-making. It provides prompt query identification, pertinent resource retrieval, data point validation, extraction, and the creation of actionable insights. The solution was developed in AWS, we utilized Bedrock Model Models, Knowledge Base, Flows and Agent. We also utilized Kendra as our datasource. We utilized Lambda as our compute platform.

Problem Statement:
Evolving Data Sources and dynamic research needs make Manual Research sub-optimal with longer cycle times, reduced quality and increased costs & inefficiencies
Solution Overview:

1. Solution Approach: Modular agents that dynamically accomplish multiple research tasks and orchestration to manage the flow of tasks. This is enabled thru a chat interface which navigates the user progressively thru the research - Discovery, Extraction, Reasoning, Analysis & Reporting on enterprise-wide and web-based data sources varying in their content and format.
2. Your Solution: Application harnessing Generative AI & Agentic flows for efficient Capital Market Research for automated insights and decision support in enterprises. This is illustrated with a workflow for an analyst looking to improve his investment portfolio
3. Key Features:
   •Interface – Easy conversational interface to accomplish a variety of research goals and queries answered
   •Modular Agentic Flow – Orchestration agent dynamically allocates tasks to multiple task agents
   •Discovery – Know most relevant content for the research from enterprise sources and alternative web-based sources for the user scenarios alongside summaries, key topics of the artefact explain the relevance
   •Extract – Automated Key Metric extraction from multiple relevant sources
   •Analyze – Ask deeper questions on extracted metrices in a conversational mode
   •Report – Dynamic dashboard to visualize extracted metrics thru charts, summaries and downloaded reports
   •Configuration – Define data sources and workflows to establish boundaries for research
4. Technical Implementation: Tech Stack comprising Gen AI Models(Claude Sonnet, AWS Titan), AI/ML, Python, Web Technologies, AWS Services
5. Industry Impact, Collaboration and Production Viability:
   Impact: Assisted, affordable and quality research to enable fast investment decisions
   Potential Path to Production: Pilot the solution for limited user base with larger data and variety, fine-tune the application for production rollout
   Scalability of your solution at an enterprise level: Modular design that can adapt to varied research goals, accommodate multiple data modalities, volumes while maintaining quality levels
   Highlight collaboration with industry partners (if any): NA
   Potential challenges and limitations: Might require more configuration efforts for other domains

### Team Information

Tech Geniuses

## Using DCO to sign your commits

**All commits** must be signed with a DCO signature to avoid being flagged by the DCO Bot. This means that your commit log message must contain a line that looks like the following one, with your actual name and email address:

```
Signed-off-by: John Doe <john.doe@example.com>
```

Adding the `-s` flag to your `git commit` will add that line automatically. You can also add it manually as part of your commit log message or add it afterwards with `git commit --amend -s`.

See [CONTRIBUTING.md](./.github/CONTRIBUTING.md) for more information

### Helpful DCO Resources

- [Git Tools - Signing Your Work](https://git-scm.com/book/en/v2/Git-Tools-Signing-Your-Work)
- [Signing commits
  ](https://docs.github.com/en/github/authenticating-to-github/signing-commits)

## License

Copyright 2025 FINOS

Distributed under the [Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0).

SPDX-License-Identifier: [Apache-2.0](https://spdx.org/licenses/Apache-2.0)
