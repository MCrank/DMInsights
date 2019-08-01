using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DMInsights.Hubs
{
    public class Battle : Hub
    {
        public Task SendMessageToAll(string message)
        {
            return Clients.Others.SendAsync("ReceiveMessage", message);
        }

        public async Task AddToGroup(string groupName, string userName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

            await Clients.Group(groupName).SendAsync("ReceiveMessage", $"{userName} has joined the group.");
        }

        public async Task RemoveFromGroup(string groupName, string userName)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);

            await Clients.Group(groupName).SendAsync("ReceiveMessage", $"{userName} has left the group.");
        }

        public async Task CharacterJoinedParty(string groupName, string characterName)
        {
            await Clients.Group(groupName).SendAsync("ReceiveMessage", $"{characterName} has joined the party.");
        }
    }
}
