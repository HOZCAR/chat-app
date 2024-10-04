Feature: Chat Functionality

  Scenario: Send a message
    Given I am logged in as "user1"
    When I send a message "Hello, World!"
    Then I should see the message "user1: Hello, World!" in the chat history