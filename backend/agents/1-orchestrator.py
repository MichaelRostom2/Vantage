from uagents import Agent, Context, Model

class ScoreRequest(Model):
    neighborhood: str
    business_type: str
    target_demo: str

class ScoreResponse(Model):
    score: int
    confidence: str 
    breakdown: dict = {}

class CompetitorRequest(Model):
    lat: float
    lng: float
    business_type: str
    radius: int = 1000  # meters

class Competitor(Model):
    name: str
    rating: float
    reviews: int
    price_level: int
    address: str

class CompetitorResponse(Model):
    competitors: list
    saturation_score: int  # 0-100, higher = more saturated
    gap_analysis: str
    data_source: str


orchestrator = Agent(
    name="orchestrator",
    seed="orchdawg",
    port=8000,
    endpoint=["http://localhost:8000/submit"],
    network="testnet",
)
location_scout_address = "agent1q2rxj77hatz0cc7d24vulv4fuwpm86f5j8fy776clrjfhspcvtgwuzxrllq"
competitor_intel_address = "agent1qwztegem8pxg4u3edsvwngrnx2pqu9ju8fd50kz9l4yvakqqysn2xjdamxu"


@orchestrator.on_event("startup")
async def startup_function(ctx: Context):
    ctx.logger.info(f"Hello, I'm agent {orchestrator.name} and my address is {orchestrator.address}.")


    # # ask for location score for that business
    # msg = ScoreRequest(neighborhood="Williamsburg, Brooklyn",
    #                    business_type="bubble tea",
    #                    target_demo="Gen Z")
    # ctx.logger.info(f"Sending message to location_scout at {location_scout_address}")
    # await ctx.send(location_scout_address, msg)

    # ask for location score for that business
    msg = CompetitorRequest(lng=-73.9935,
                            lat=40.7506,
                            radius=1000,
                            business_type="coffee shop")
    ctx.logger.info(f"Sending message to competitor_intel at {competitor_intel_address}")
    await ctx.send(competitor_intel_address, msg)


@orchestrator.on_message(model=ScoreResponse)
async def handle_score_response(ctx: Context, sender: str, msg: ScoreResponse):
    ctx.logger.info(f'I have received a ScoreResponse from {sender}.')
    ctx.logger.info(f"Received score: {msg.score}")
    ctx.logger.info(f"Confidence: {msg.confidence}")
    ctx.logger.info(f"Breakdown: {msg.breakdown}")

@orchestrator.on_message(model=CompetitorResponse)
async def handle_competitor_response(ctx: Context, sender: str, msg: CompetitorResponse):
    ctx.logger.info(f'I have received a CompetitorResponse from {sender}.')
    ctx.logger.info(f"competitors: {msg.competitors}")
    ctx.logger.info(f"saturation_score: {msg.saturation_score}")
    ctx.logger.info(f"gap_analysis: {msg.gap_analysis}")
    ctx.logger.info(f"data_source: {msg.data_source}")


if __name__ == "__main__":
    orchestrator.run()
