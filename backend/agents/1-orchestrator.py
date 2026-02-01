from uagents import Agent, Context, Model
import asyncio

class ScoreResponse(Model):
    score: int
    confidence: str 
    breakdown: dict = {}

class ScoreRequest(Model):
    neighborhood: str
    business_type: str
    target_demo: str
    latitude: float
    longitude: float
    rent_estimate: float # monthly

class RevenueRequest(Model):
    business_type: str
    neighborhood: str
    foot_traffic_score: int  # 0-100
    competition_count: int
    rent_estimate: float  # monthly

class RevenueResponse(Model):
    conservative: int
    moderate: int
    optimistic: int
    breakeven_months: int
    confidence: str
    assumptions: list

class output(Model):
    loc_result: ScoreResponse = None
    comp_result: ScoreResponse = None
    rev_result: RevenueResponse = None

orchestrator = Agent(
    name="orchestrator",
    seed="orchdawg",
    port=8000,
    endpoint=["http://localhost:8000/submit"],
    network="testnet",
)

location_scout_address = "agent1qtmh344czvgrgregw9xf7490s7a9qc9twvz3njq6ye6rn0gnpwjg53el5um"
competitor_intel_address = "agent1qwztegem8pxg4u3edsvwngrnx2pqu9ju8fd50kz9l4yvakqqysn2xjdamxu"
revenue_analyst_address = "agent1qvjvmz2ej8vnjpxnw8fhkazfky2mfx5se4au508xapjrmdkhf9782cwpm5q"


@orchestrator.on_event("startup")
async def startup_function(ctx: Context):
    ctx.logger.info(f"Hello, I'm agent {orchestrator.name} and my address is {orchestrator.address}.")


@orchestrator.on_message(model=ScoreRequest)
async def handle_score_request(ctx: Context, sender: str, msg: ScoreRequest):
    """
    loc scout returns:
    {
        "score": int,
        "confidence": str,
        "breakdown": {
            "foot_traffic": {
                "score": int,
                "nearby_locations": list,
                "average_pedestrians": int,
                "count": int
            },
            "transit_access": {
                "score": int,
                "nearby_stations": list,
                "count": int
            }
        }
    }

    competitor_intel returns:
    {
        "score": int,
        "confidence": str,
        "breakdown": {
            "competitors": list,
            "saturation_score": int,
            "gap_analysis": str,
            "competitor_count": int,
            "confidence_basis": {
                "competitor_count": int,
                "total_reviews": int,
                "rating_coverage": float,
                "radius_meters": int
            }
        }
    }

    revenue_analyst returns:
    {
        "conservative": int,
        "moderate": int,
        "optimistic": int,
        "breakeven_months": int,
        "confidence": str,
        "assumptions": list
    }   
    """

    ctx.logger.info(f'I have received a ScoreRequest from {sender}.')
    ctx.logger.info(f"Neighborhood: {msg.neighborhood}")
    ctx.logger.info(f"Business Type: {msg.business_type}")
    ctx.logger.info(f"Target Demographic: {msg.target_demo}")
    ctx.logger.info(f"Latitude: {msg.latitude}")
    ctx.logger.info(f"Longitude: {msg.longitude}")
    ctx.logger.info(f"Rent Estimate: {msg.rent_estimate}")

    # ask for location score for that business
    msg = ScoreRequest(neighborhood=msg.neighborhood,
                       business_type=msg.business_type,
                       target_demo=msg.target_demo,
                       latitude=msg.latitude,
                       longitude=msg.longitude,
                       rent_estimate=msg.rent_estimate)
    ctx.logger.info(f"Sending message to location_scout at {location_scout_address}")
    await ctx.send(location_scout_address, msg)

    # ask for competitor intel for that business
    msg = ScoreRequest(neighborhood=msg.neighborhood,
                       business_type=msg.business_type,
                       target_demo=msg.target_demo,
                       latitude=msg.latitude,
                       longitude=msg.longitude,
                       rent_estimate=msg.rent_estimate)
    ctx.logger.info(f"Sending message to competitor_intel at {competitor_intel_address}")
    await ctx.send(competitor_intel_address, msg)

    # ask for revenue analyst for that business
    msg = RevenueRequest(business_type=msg.business_type,
                       neighborhood=msg.neighborhood,
                       foot_traffic_score=out.loc_result.breakdown.foot_traffic.count,
                       competition_count=out.comp_result.breakdown.competitor_count,
                       rent_estimate=msg.rent_estimate)
    ctx.logger.info(f"Sending message to revenue_analyst at {revenue_analyst_address}")
    await ctx.send(revenue_analyst_address, msg)

@orchestrator.on_message(model=ScoreResponse)
async def handle_score_response(ctx: Context, sender: str, msg: ScoreResponse):
    ctx.logger.info(f'I have received a ScoreResponse from {sender}.')
    ctx.logger.info(f"Received score: {msg.score}")
    ctx.logger.info(f"Confidence: {msg.confidence}")
    ctx.logger.info(f"Breakdown: {msg.breakdown}")
    if not out.loc_result:
        out.loc_result = msg
    elif not out.comp_result:
        out.comp_result = msg
    

@orchestrator.on_message(model=RevenueResponse)
async def handle_revenue_response(ctx: Context, sender: str, msg: RevenueResponse):
    ctx.logger.info(f'I have received a RevenueResponse from {sender}.')
    ctx.logger.info(f"Received conservative: {msg.conservative}")
    ctx.logger.info(f"Received moderate: {msg.moderate}")
    ctx.logger.info(f"Received optimistic: {msg.optimistic}")
    ctx.logger.info(f"Received breakeven_months: {msg.breakeven_months}")
    ctx.logger.info(f"Received confidence: {msg.confidence}")
    ctx.logger.info(f"Received assumptions: {msg.assumptions}")
    if not out.rev_result:
        out.rev_result = msg
    else:
        ctx.logger.info(f"Received all responses.")
        ctx.logger.info(f"Final Output: {out}")
    
    print(out.dict())

if __name__ == "__main__":
    out = output()
    orchestrator.run()

