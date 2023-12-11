using BilimShare.Data;

namespace BilimShare.Services
{
    public interface IJwtService
    {
        string CreateToken(BilimShareUser user);
    }
}
