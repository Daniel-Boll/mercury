# Resume Tailor — Examples

## Before/After: Summary Section

### Before (generic)
```typst
#summary[
  Software Engineer with experience in distributed systems and cloud computing.
  Passionate about building scalable applications.
]
```

### After (tailored for Airbnb backend role)
```typst
#summary[
  Software Engineer at Amazon building high-throughput distributed systems
  serving millions of requests daily. Specialized in Java/AWS microservices
  architecture with hands-on TypeScript and infrastructure-as-code.
  Experienced in payments-adjacent domains and cross-team platform work.
]
```

**What changed**: Generic "passionate about" → specific impact language echoing Airbnb's JD keywords (distributed systems, high-throughput, microservices, payments).

---

## Before/After: Experience Bullet

### Before
```typst
- Developed backend services using Java and AWS
```

### After (tailored for DoorDash logistics platform role)
```typst
- Designed and shipped Java microservices processing 2M+ daily events on AWS,
  reducing p99 latency by 40% through async message-driven architecture (SQS/SNS)
```

**What changed**: Added quantification, specific AWS services (ATS keywords), and outcome — mirrors DoorDash's JD emphasis on "high-scale event processing" and "latency-sensitive systems."

---

## Gap/Match Report Example

### Role: Backend Engineer @ DoorDash (ID: 3969556398)

| Requirement | Status | Evidence / Framing |
|---|---|---|
| Java (3+ years) | ✅ Strong | Amazon SDE — Java daily, microservices |
| Kotlin | 🟡 Transferable | Java expertise + personal Kotlin projects |
| Distributed Systems | ✅ Strong | Core of Amazon role, event-driven arch |
| gRPC | ❌ Gap | Experience with REST/GraphQL, can ramp quickly |
| Kubernetes | 🟡 Transferable | AWS ECS/Fargate experience, container-native |
| CI/CD pipelines | ✅ Strong | Amazon internal CI + GitHub Actions OSS |
| 5+ years experience | 🟡 Stretch | ~4 years but high-impact scope at Amazon |

**Keyword coverage**: 78% (12/15 ATS terms present)

**Recommended framing for gaps**:
- *gRPC*: "Experience designing service-to-service communication layers (REST, async messaging); eager to apply protocol buffer patterns"
- *Kotlin*: Mention any personal/OSS Kotlin work; emphasize JVM fluency

---

## Cover Letter Example

### For: Backend Engineer @ DoorDash, São Paulo

> Dear DoorDash Engineering Team,
>
> I'm drawn to DoorDash's challenge of building logistics infrastructure that
> serves millions of merchants and dashers across Brazil — a market I've watched
> you grow from 3 to 120+ engineers in São Paulo.
>
> At Amazon, I design high-throughput Java microservices that process millions of
> daily events with sub-100ms p99 latency. My work on distributed event pipelines
> (SQS, SNS, DynamoDB Streams) maps directly to the real-time coordination
> problems in delivery logistics. I've shipped systems that handle graceful
> degradation under load — critical when a surge of lunch orders hits
> simultaneously.
>
> I bring strong AWS and infrastructure-as-code experience, and while my
> container orchestration has been ECS-based rather than Kubernetes, the mental
> models transfer directly. I'm excited to deepen my Kotlin and gRPC skills in
> DoorDash's stack.
>
> I'd welcome the chance to discuss how my distributed systems background fits
> your platform engineering needs. I'm based in São Paulo and available for
> interviews starting next week.
>
> Best regards,
> Daniel Boll
