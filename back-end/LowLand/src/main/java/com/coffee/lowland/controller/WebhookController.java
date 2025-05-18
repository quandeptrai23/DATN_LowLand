package com.coffee.lowland.controller;

import com.coffee.lowland.DTO.response.utilities.APIResponse;
import com.coffee.lowland.service.Order.OrderService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.payos.type.Webhook;

import java.util.LinkedHashMap;

@Slf4j
@RestController
@RequestMapping("")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class WebhookController {
    private final OrderService orderService;

    @PostMapping("/payment-result")
    public APIResponse<String> handlePaymentResult(@RequestBody(required = false) Object request) throws Exception {
        if (request instanceof LinkedHashMap<?, ?> map) {
            Webhook webhook = new ObjectMapper().convertValue(map, Webhook.class);
            log.info("Webhook request: {}", webhook);
            return APIResponse.<String>builder()
                    .code(2000)
                    .result(orderService.payResult(webhook))
                    .build();
        }
        log.info("Not a webhook request: {}", request);
        return APIResponse.<String>builder()
                .code(2000)
                .result(null)
                .build();
    }
}
